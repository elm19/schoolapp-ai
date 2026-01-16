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

    return (
      <ContentLayout title={title}>
        <div className="mx-auto py-6">
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
                              (question: any, qIndex: number) => (
                                <div
                                  key={qIndex}
                                  className="border-l-4 border-blue-500 pl-3 py-2"
                                >
                                  <p className="font-semibold text-gray-800">
                                    Q{qIndex + 1}: {question.question}
                                  </p>
                                  <p className="text-gray-600 mt-1">
                                    <span className="font-medium">
                                      Student's Answer:
                                    </span>{" "}
                                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                    {/* @ts-ignore */}
                                    {submission.sub?.[String(qIndex + 1)] ||
                                      "Not answered"}
                                  </p>
                                  {question.options && (
                                    <p className="text-gray-500 text-xs mt-1">
                                      Options: {question.options.join(", ")}
                                    </p>
                                  )}
                                </div>
                              )
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
