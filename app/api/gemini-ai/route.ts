import { quizGenerationPrompt } from "@/constants/prompts";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // check if the user is logged in
    const { prompt, source, course_id } = await req.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }
    let finalPrompt = prompt;
    if (course_id && source) {
      finalPrompt = quizGenerationPrompt + `\n\nCourse Overview:\n${prompt}`;
    }

    const result = await model.generateContent(finalPrompt);
    const responseText = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const quizJson = JSON.parse(responseText);
    
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