import { QuizRow } from "@/app/(protected)/quiz/[id]/page";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const markQuizSubmission = (
  questions: QuizRow["quiz_data"]["questions"],
  submission: Record<string, string>
) => {
  let score = 0;
  questions.forEach((question) => {
    const userAnswer = submission[`${question.id}`] || "none";
    const correctAnswer = String(question.correctAnswerIndex);
    if (userAnswer === correctAnswer) {
      score += 1;
    }
  });
  return (score / questions.length) * 20;
};

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // check if the user is logged in
    const { quizId, data } = await req.json();
    if (!data || !quizId) {
      return NextResponse.json(
        { error: "the quizId and data are required" },
        { status: 400 }
      );
    }
    const { data: quizData } = await supabase
      .from("quizzes")
      // fixed select string
      .select(`quiz_data`)
      .eq("id", quizId)
      .single<QuizRow>();

    if (!quizData) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    const mark = markQuizSubmission(quizData.quiz_data.questions, data);
    const { error } = await supabase.from("quizzes_sub").insert([
      {
        sub: data,
        quiz_id: quizId,
        mark: mark,
      },
    ]);
    if (error) {
      throw error;
    }
    return NextResponse.json({
      message: "Enrolled successfully",
      data,
      status: 200,
    });
  } catch (error) {
    console.error("Error in Enrolling:", error);
    return NextResponse.json(
      { error: "Failed to Enroll in this course" },
      { status: 500 }
    );
  }
}