import { ContentLayout } from "@/components/admin-panel/content-layout";
import { QuizRow } from "../page";
import { createClient } from "@/lib/supabase/server";
import QuizForm from "@/components/quiz/quizFromQuestions";
import CountDownTimer from "@/components/countdown-timer";

type Props = { params: Promise<{ id: string }> };

const TakeQuizPage = async ({ params }: Props) => {
  const { id } = await params;
  const supabase = await createClient();

  try {
    const quizData = await supabase
      .from("quizzes")
      // fixed select string
      .select(`*`)
      .eq("id", id)
      .single<QuizRow>();

    if (quizData.error || !quizData.data) {
      throw quizData.error ?? new Error("No quiz data");
    }
    const { questions } = quizData.data.quiz_data;
    const { available_to } = quizData.data;
    console.log("Available to date:", available_to);
    return (
      <ContentLayout title={quizData.data.quiz_data?.quizTitle}>
        <CountDownTimer finishDate={new Date(available_to)} />
        <QuizForm questions={questions.slice(0,1)} quizId={id} />
      </ContentLayout>
    );
  } catch (error) {
    console.error("Error fetching course data:", error);
    return (
      <ContentLayout title="Course Not Found">
        
        <div className="mx-auto py-6">
          <h2 className="text-2xl font-bold">Quiz Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The quiz you are looking for does not exist or an error occurred
            while fetching the data.
          </p>
        </div>
      </ContentLayout>
    );
  }
};
export default TakeQuizPage;
