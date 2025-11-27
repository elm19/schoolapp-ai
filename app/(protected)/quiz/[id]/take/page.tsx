import { ContentLayout } from "@/components/admin-panel/content-layout";
import { QuizRow } from "../page";
import { createClient } from "@/lib/supabase/server";
import QuizForm from "@/components/quiz/quizFromQuestions";

type Props = { params: Promise<{ id: string }> };

const TakeQuizPage = async ({ params }: Props) => {
  const { id } = await params;
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id || "";
  try {
    const quizData = await supabase
      .from("quizzes")
      // fixed select string
      .select(`*,courses(title,id, profiles(username))`)
      .eq("id", id)
      .single<QuizRow>();

    if (quizData.error || !quizData.data) {
      throw quizData.error ?? new Error("No quiz data");
    }
    const { questions } = quizData.data.quiz_data;
    return (
      <ContentLayout title={quizData.data.quiz_data?.quizTitle}>
        <QuizForm questions={questions.slice(0,2)} userId={userId} quizId={id} />
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
