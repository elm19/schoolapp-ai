import { generateQuizzPrompt } from "@/constants/prompts";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get Gemini API key from Supabase table, fallback to env
    let geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY || "";
    let supabaseKeyId: string | null = null;

    try {
      const { data: keyData, error: keyError } = await supabase
        .from("gemini_keys")
        .select("id, key")
        .eq("user_id", user.data.user.id)
        .maybeSingle();

      if (keyData && keyData.key && !keyError) {
        geminiApiKey = keyData.key;
        supabaseKeyId = keyData.id;
        console.log("Using Gemini API key from Supabase");
      } else {
        console.log("Supabase key not found or error occurred, using env key");
      }
    } catch (dbError) {
      console.warn("Failed to fetch key from database, using env key", dbError);
    }

    if (!geminiApiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // check if the user is logged in
    const { prompt, source, course_id, quizInfo } = await req.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }
    let finalPrompt = prompt;
    if (course_id && source) {
      finalPrompt = generateQuizzPrompt(prompt, quizInfo);
    }

    const result = await model.generateContent(finalPrompt);
    const responseText = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Update usage stats if using Supabase key
    if (supabaseKeyId) {
      try {
        // First fetch the current usage count
        const { data: currentKey } = await supabase
          .from("gemini_keys")
          .select("usage")
          .eq("id", supabaseKeyId)
          .single();

        const newUsage = (currentKey?.usage || 0) + 1;

        await supabase
          .from("gemini_keys")
          .update({
            usage: newUsage,
            last_used: new Date().toISOString(),
          })
          .eq("id", supabaseKeyId);
      } catch (updateError) {
        console.warn("Failed to update API key usage stats", updateError);
        // Don't fail the request if usage update fails
      }
    }
    console.log("Gemini API response:", responseText);
    if (source !== true) {
      return NextResponse.json({ output: responseText });
    }

    // Try to parse JSON, handling cases where markdown formatting might be present
    let quizJson;
    try {
      quizJson = JSON.parse(responseText);
    } catch {
      // If parsing fails, try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }
      quizJson = JSON.parse(jsonMatch[0]);
    }

    await supabase.from("quizzes").insert([
      {
        quiz_data: quizJson,
        course_id: course_id,
      },
    ]);
    return NextResponse.json({ output: responseText });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
