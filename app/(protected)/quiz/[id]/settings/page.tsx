import { ContentLayout } from "@/components/admin-panel/content-layout";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { QuizRow } from "../page";
import QuizSettingsForm from "@/components/quiz/quiz-settings-form";

type Props = { params: Promise<{ id: string }> };

const QuizSettingsPage = async ({ params }: Props) => {
  const { id } = await params;
  const supabase = await createClient();
  try {
    const quizData = await supabase
      .from("quizzes")
      // fixed select string
      .select(`*,courses(title,id, profiles(username)), quizzes_sub(*)`)
      .eq("id", id)
      .single<QuizRow>();

    if (quizData.error || !quizData.data) {
      throw quizData.error ?? new Error("No quiz data");
    }

    const { quiz_data, created_at, available_from, available_to, courses } =
      quizData.data;

    const title = quiz_data?.quizTitle || "Quiz";

    return (
      <ContentLayout title={title}>
        <div className="mx-auto py-6 space-y-6">
          <Card>
            <CardHeader className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <Avatar className="hidden sm:inline-flex">
                  <AvatarFallback>{"Q"}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{title}</h2>
                  <Link
                    href={`/courses/${courses?.id}`}
                    className="text-sm text-muted-foreground"
                  >
                    {courses?.title}
                  </Link>
                  <div className="text-xs text-muted-foreground mt-1">
                    Created{" "}
                    {created_at ? new Date(created_at).toLocaleString() : "—"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Link href={`/api/quiz/download/${id}`} download>
                    Download JSON
                  </Link>
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Quiz Settings Form */}
                <QuizSettingsForm
                  quizId={id}
                  title={title}
                  availableFrom={available_from}
                  availableTo={available_to}
                />
        </div>
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
export default QuizSettingsPage;
