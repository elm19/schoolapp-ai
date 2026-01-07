import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "timeago.js";
import { ParticipantsCounter } from "./participants-counter";
import { Separator } from "../ui/separator";

type Props = {
  title: string;
  overview: string;
  createdAt: string;
  creator: string;
  participantsCount: number;
};

export const CourseHeader = ({
  title,
  overview,
  createdAt,
  creator,
  participantsCount,
}: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 hidden sm:inline-flex shrink-0">
          <AvatarFallback>C</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold break-words">
            {title}
          </h1>

          <p className="text-sm text-muted-foreground break-words whitespace-normal">
            {overview}
          </p>

          <div className="text-xs text-muted-foreground mt-1">
            Created {format(createdAt)} • by {creator}
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ParticipantsCounter count={participantsCount} />
          </div>
          <Separator className="my-4" />
        </div>
      </div>
    </div>
  );
};
