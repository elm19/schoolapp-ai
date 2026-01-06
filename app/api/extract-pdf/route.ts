// app/api/extract-pdf/route.ts
import { extractPdfText } from "@/lib/pdfUtils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { path } = await req.json();

    if (!path) {
      return NextResponse.json(
        { error: "No PDF file path provided" },
        { status: 400 }
      );
    }
      
    const extractedText = await extractPdfText(path);
    return NextResponse.json({
      success: true,
      text: extractedText,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      {
        error: "Failed to process PDF",
        details: error
      },
      { status: 500 }
    );
  }
}
