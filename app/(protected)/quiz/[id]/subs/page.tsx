import { ContentLayout } from "@/components/admin-panel/content-layout";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Quiz Submissions",
  description: "View quiz submissions and results",
};

const QuizSubPage = async ({ params }: Props) => {
  const { id } = await params;
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const isTeacher = user.data.user?.user_metadata?.type === "teacher";
  if (!isTeacher) {
    throw new Error("Access denied. Only teachers can view submissions.");
  }
  try {
    const quizSubData = await supabase
      .from("quizzes_sub")
      // fixed select string
      .select(`profiles(username), created_at, sub, mark, quizzes(quiz_data)`)
      .eq("quiz_id", id)
      .order("created_at", { ascending: false });

    console.log(quizSubData);

    if (quizSubData.error || !quizSubData.data) {
      throw quizSubData.error ?? new Error("No quiz data");
    }

    const title = "Quiz Submissions Page";

    // Calculate statistics
    const marks = quizSubData.data.map((sub) => sub.mark || 0);
    const totalSubmissions = marks.length;
    const totalMarks = marks.reduce((sum, mark) => sum + mark, 0);
    const averageMarks =
      totalSubmissions > 0 ? (totalMarks / totalSubmissions).toFixed(2) : 0;
    const maxMarks = totalSubmissions > 0 ? Math.max(...marks) : 0;
    const minMarks = totalSubmissions > 0 ? Math.min(...marks) : 0;

    return (
      <ContentLayout title={title}>
        <div className="mx-auto py-6">
          {/* Statistics Component */}
          {totalSubmissions > 0 && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalSubmissions}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Average Marks</p>
                <p className="text-2xl font-bold text-green-600">
                  {averageMarks}
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Max Marks</p>
                <p className="text-2xl font-bold text-purple-600">{maxMarks}</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Min Marks</p>
                <p className="text-2xl font-bold text-orange-600">{minMarks}</p>
              </div>
            </div>
          )}

          {quizSubData.data.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <p>No submissions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left font-semibold">
                      Submitted At
                    </th>
                    <th className="px-6 py-3 text-left font-semibold">Mark</th>
                    <th className="px-6 py-3 text-left font-semibold">
                      Answers
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quizSubData.data.map((submission, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                        {/* @ts-ignore */}
                        {submission.profiles?.username || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(submission.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {submission.mark}
                      </td>
                      <td className="px-6 py-4">
                        <details className="cursor-pointer">
                          <summary className="text-blue-600 hover:underline">
                            View Answers
                          </summary>
                          <div className="mt-2 text-sm bg-gray-50 p-3 rounded overflow-auto max-h-96 space-y-3">
                            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                            {/* @ts-ignore */}

                            {submission.quizzes?.quiz_data?.questions?.map(
                              (
                                question: Record<string, unknown>,
                                qIndex: number
                              ) => {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                const studentAnswerIndex = Number(
                                  submission.sub?.[String(qIndex + 1)]
                                );
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                const correctAnswerIndex: number =
                                  question.correctAnswerIndex;
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                const options: string[] =
                                  question.options || [];

                                const isAnswered =
                                  studentAnswerIndex !== null &&
                                  studentAnswerIndex !== undefined &&
                                  !Number.isNaN(studentAnswerIndex);
                                const isCorrect =
                                  isAnswered &&
                                  studentAnswerIndex === correctAnswerIndex;

                                const studentAnswerText = isAnswered
                                  ? (options as string[])[studentAnswerIndex] ||
                                    "Invalid answer"
                                  : "Not answered";
                                const correctAnswerText =
                                  (options as string[])[correctAnswerIndex] ||
                                  "N/A";

                                return (
                                  <div
                                    key={qIndex}
                                    className={`border-l-4 pl-3 py-2 ${
                                      isCorrect
                                        ? "border-green-500 bg-green-50"
                                        : isAnswered
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-300 bg-gray-50"
                                    }`}
                                  >
                                    <div className="flex items-start justify-between">
                                      <p className="font-semibold text-gray-800">
                                        Q{qIndex + 1}:{" "}
                                        {String(question.question)}
                                      </p>
                                      <span
                                        className={`text-xs font-bold px-2 py-1 rounded ${
                                          isCorrect
                                            ? "bg-green-200 text-green-800"
                                            : isAnswered
                                            ? "bg-red-200 text-red-800"
                                            : "bg-gray-200 text-gray-800"
                                        }`}
                                      >
                                        {isCorrect
                                          ? "✓ Correct"
                                          : isAnswered
                                          ? "✗ Wrong"
                                          : "⊘ Unanswered"}
                                      </span>
                                    </div>
                                    <p className="text-gray-600 mt-2">
                                      <span className="font-medium">
                                        Student&apos;s Answer:
                                      </span>{" "}
                                      <span
                                        className={
                                          isCorrect
                                            ? "text-green-700 font-medium"
                                            : isAnswered
                                            ? "text-red-700 font-medium"
                                            : "text-gray-500"
                                        }
                                      >
                                        {studentAnswerText}
                                      </span>
                                    </p>
                                    {!isCorrect && isAnswered && (
                                      <p className="text-gray-600 mt-1">
                                        <span className="font-medium">
                                          Correct Answer:
                                        </span>{" "}
                                        <span className="text-green-700 font-medium">
                                          {correctAnswerText}
                                        </span>
                                      </p>
                                    )}
                                    {options.length > 0 && (
                                      <p className="text-gray-500 text-xs mt-1">
                                        Options: {options.join(", ")}
                                      </p>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </details>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

export default QuizSubPage;
