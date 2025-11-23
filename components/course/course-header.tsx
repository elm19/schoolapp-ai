import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "timeago.js";

type Props = {
  title: string;
  overview: string;
  createdAt: string;
  creator: string;
};

export const CourseHeader = ({
  title,
  overview,
  createdAt,
  creator,
}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-8 w-8 hidden sm:inline-flex">
          <AvatarFallback className="">C</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl capitalize font-extrabold">{title}</h1>
          <p className="text-sm text-muted-foreground">{overview}</p>
          <div className="text-xs text-muted-foreground mt-1">
            Created {format(createdAt)} • by {creator}
          </div>
        </div>
      </div>
    </div>
  );
};
