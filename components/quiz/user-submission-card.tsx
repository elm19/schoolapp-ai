import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuizQuestion } from "@/app/(protected)/quiz/[id]/page";

interface Submission {
  id: string;
  sub: Record<string, string>; // { "1": "3", "2": "1" }
  mark: number;
  quiz_id: string;
  user_id: string;
  created_at: string;
  is_private: boolean;
}

interface UserSubmissionCardProps {
  submissions: Submission[];
  currentUserId: string;
  questions: QuizQuestion[];
}

export default function UserSubmissionCard({
  submissions,
  currentUserId,
  questions,
}: UserSubmissionCardProps) {
  // Filter submissions to only show the current user's submission
  const userSubmissions = submissions.filter(
    (sub) => sub.user_id === currentUserId
  );

  if (userSubmissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Submissions</CardTitle>
          <CardDescription>Your quiz attempt history</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You haven&apos;t submitted this quiz yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show the most recent submission
  const latestSubmission = userSubmissions[0];
  const totalQuestions = questions.length;
  const percentageScore = totalQuestions
    ? Math.round((latestSubmission.mark / totalQuestions) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Submissions</CardTitle>
        <CardDescription>Your latest quiz attempt</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Summary */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
          <div>
            <p className="text-sm font-medium">Your Score</p>
            <p className="text-2xl font-bold">{latestSubmission.mark}/20</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Percentage</p>
            <p className="text-2xl font-bold">{latestSubmission.mark*5}%</p>
          </div>
          <div>
            <Badge
              variant={percentageScore >= 70 ? "default" : "secondary"}
              className="text-sm"
            >
              {percentageScore >= 70 ? "Passed" : "Failed"}
            </Badge>
          </div>
        </div>

        {/* Submission Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Submitted on:</span>
            <span className="font-medium">
              {new Date(latestSubmission.created_at).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Attempts:</span>
            <span className="font-medium">{userSubmissions.length}</span>
          </div>
        </div>

        {/* Answers Summary */}
        <div className="space-y-3 pt-4 border-t">
          <p className="font-medium text-sm">Answers Breakdown</p>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {Object.entries(latestSubmission.sub).map(([qId, answerIndex]) => {
              const questionNum = parseInt(qId);
              const question = questions[questionNum - 1];
              const answerIdx = parseInt(answerIndex);

              if (!question) return null;

              const isCorrect = answerIdx === question.correctAnswerIndex;

              return (
                <div
                  key={qId}
                  className={`p-3 rounded-md border text-sm ${
                    isCorrect
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : "border-red-500 bg-red-50 dark:bg-red-950"
                  }`}
                >
                  <div className="font-medium mb-1">
                    Question {questionNum}: {question.question}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Your answer:</span>
                    <span className="font-medium">
                      {question.options[answerIdx] || "—"}
                    </span>
                    <Badge
                      variant={isCorrect ? "default" : "destructive"}
                      className="ml-auto"
                    >
                      {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </Badge>
                  </div>
                  {!isCorrect && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Correct answer:{" "}
                      <span className="font-medium">
                        {question.options[question.correctAnswerIndex || 0]}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Attempts */}
        {userSubmissions.length > 1 && (
          <div className="text-xs text-muted-foreground pt-4 border-t">
            <p>
              You have {userSubmissions.length - 1} previous{" "}
              {userSubmissions.length - 1 === 1 ? "attempt" : "attempts"}. Your
              best score is{" "}
              <span className="font-medium">
                {Math.max(...userSubmissions.map((s) => s.mark))}/
                {totalQuestions}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
