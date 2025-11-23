import { Badge } from "@/components/ui/badge";

type Props = { count: number };

export const ParticipantsCounter = ({ count }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Participants</span>
      <Badge variant="secondary">{count}</Badge>
    </div>
  );
};
