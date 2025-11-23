import { Card } from "@/components/ui/card";
import Link from "next/link";
import { format } from "timeago.js";

type Quiz = {
  id: string;
  created_at: string;
  quiz_data: { quizTitle: string };
};

type Props = { quizzes: Quiz[] };

export const QuizzesSection = ({ quizzes }: Props) => {
  console.log(quizzes);
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold">Quizzes</h3>
      <div className="grid gap-3">
        {quizzes.map((q) => (
          <Card key={q.id} className="p-4 flex justify-between items-center">
            <div>
              <div className="font-medium">{q.quiz_data.quizTitle}</div>
              <div className="text-sm text-muted-foreground">
                {format(q.created_at)}
              </div>
            </div>
            <div>
              <Link href={`/quiz/${q.id}`} className="text-sm text-primary underline">View</Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
