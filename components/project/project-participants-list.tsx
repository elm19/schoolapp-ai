"use client";

import { ProjectParticipant } from "@/types/project";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddParticipantsSheet } from "./add-participants-sheet";

interface ProjectParticipantsListProps {
  participants: ProjectParticipant[];
  projectId: string;
  isCreator: boolean;
}

export const ProjectParticipantsList = ({
  participants,
  projectId,
  isCreator,
}: ProjectParticipantsListProps) => {
  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="mt-6 w-[90%]">
      <CardHeader className="flex items-center flex-row justify-between space-y-8">
        <div>
          <CardTitle>Project Participants</CardTitle>
          <CardDescription>
            {participants.length} participant
            {participants.length !== 1 ? "s" : ""} enrolled
          </CardDescription>
        </div>
        {isCreator && (
          <AddParticipantsSheet projectId={projectId} />
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {participants.map((participant, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs">
                  {getInitials(participant.profiles.username)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {participant.profiles.username}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
