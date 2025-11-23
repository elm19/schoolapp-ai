import { Card } from "@/components/ui/card";
import { Markdown } from "../ui/markdown";
import { format } from "timeago.js";
import { AddAnnouncement } from "./anounce";

type Announcement = {
  id: string;
  content: string;
  created_at: string;
};

type Props = { course_id:number, announcements: Announcement[] };

export const AnnouncementsSection = ({course_id,  announcements }: Props) => {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Announcements / Progress</h3>
        <AddAnnouncement course_id={course_id} />
      </div>
      <div className="grid gap-3">
        {announcements
          .slice()
          .reverse()
          .map((a) => (
            <Card key={a.id} className="p-4">
              <div className="flex flex-col gap-2">
                <Markdown>{a.content}</Markdown>

                <div className="text-xs w-full text-right text-muted-foreground">
                  {format(a.created_at)}
                </div>
              </div>
            </Card>
          ))}
      </div>
    </section>
  );
};
