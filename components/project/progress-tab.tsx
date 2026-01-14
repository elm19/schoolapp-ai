import { AddProgress } from "./addProgress";
import { Markdown } from "@/components/ui/markdown";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "timeago.js";

interface ProgressItem {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  project_id: string;
}

interface ProgressTabProps {
  progress: ProgressItem[] | null;
  projectId: string;
}

const ProgressTab = ({ progress, projectId }: ProgressTabProps) => {
  return (
    <div className="space-y-6">
      <AddProgress projectId={projectId} />

      <div className="space-y-4">
        {progress && progress.length > 0 ? (
          progress.map((item) => (
            <Card key={item.id} className="border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      {format(item.created_at)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      By: {item.created_by.slice(0, 8)}...
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ID: {item.id.slice(0, 8)}...
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <Markdown>{item.content}</Markdown>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No progress updates yet. Add one to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTab;
