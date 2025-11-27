import { ContentLayout } from "@/components/admin-panel/content-layout";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

export type QuizQuestion = {
  id: string | number;
  question: string;
  options: string[];
  correctAnswerIndex?: number;
};

export type QuizRow = {
  id: string;
  quiz_data: {
    quizTitle: string;
    questions: QuizQuestion[];
  };
  created_at: string;
  available_from: string | null;
  available_to: string | null;
  courses: {
    title: string;
    id: string;
    profiles?: { username?: string } | null;
  };
};

const CoursePage = async ({ params }: Props) => {
  const { id } = await params;
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const isTeacher = user.data.user?.user_metadata?.type === "teacher";
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
                {isTeacher ? (
                  <Button size="sm">Settings</Button>
                ) : (
                  <Link href={`/quiz/${id}/take`}>
                    <Button>Take Quiz</Button>
                  </Link>
                )}
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {isTeacher && (
                <Card>
                  <CardHeader>
                    <CardTitle>Questions</CardTitle>
                    <CardDescription>
                      List of questions from the quiz data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {quiz_data?.questions?.length ? (
                        quiz_data.questions.map(
                          (q: QuizQuestion, idx: number) => {
                            const correctIndex =
                              typeof q.correctAnswerIndex === "number"
                                ? q.correctAnswerIndex
                                : -1;
                            return (
                              <div
                                key={String(q.id)}
                                className="p-4 rounded-md border"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground font-medium">
                                    {idx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium">
                                      {q.question}
                                    </div>
                                    <div className="mt-2 grid gap-2">
                                      {q.options.map((opt, oi) => {
                                        const isCorrect = oi === correctIndex;
                                        return (
                                          <div
                                            key={oi}
                                            className={`flex items-center justify-between p-2 rounded-md border ${
                                              isCorrect
                                                ? "border-green-500 bg-green-50"
                                                : "border-transparent"
                                            }`}
                                          >
                                            <div className="text-sm">{opt}</div>
                                            {isCorrect && (
                                              <Badge variant="secondary">
                                                Answer
                                              </Badge>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No questions available.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Metadata</CardTitle>
                  <CardDescription>Availability & course info</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>
                      <strong>Available from:</strong> {available_from ?? "—"}
                    </div>
                    <div>
                      <strong>Available to:</strong> {available_to ?? "—"}
                    </div>
                    <div className="my-2" />
                    <div>
                      <strong>Course:</strong> {courses?.title ?? "—"}
                    </div>
                    <div>
                      <strong>Creator:</strong>{" "}
                      {courses?.profiles?.username ?? "—"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <Button>Preview</Button>
                    <Button variant="ghost">Export</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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

export default CoursePage;
