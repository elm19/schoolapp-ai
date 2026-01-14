"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "timeago.js";
import { AlertCircle } from "lucide-react";
import { AddParticipantsSheet } from "./add-participants-sheet";

interface ProjectHeaderProps {
  title: string;
  overview: string;
  creator: {
    id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  participantsCount: number;
  isCreator: boolean;
  hasParticipants: boolean;
  projectId: string;
}

export const ProjectHeader = ({
  title,
  overview,
  creator,
  createdAt,
  updatedAt,
  isCreator,
  hasParticipants,
  projectId,
}: ProjectHeaderProps) => {
  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Main Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{title}</CardTitle>
          <p className="text-base text-muted-foreground mt-2">{overview}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Creator Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Instructor
            </h3>
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{getInitials(creator.username)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{creator.username}</p>
                <p className="text-xs text-muted-foreground">{creator.email}</p>
              </div>
            </div>
          </div>

          {/* Dates Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Created
              </p>
              <p className="text-sm font-medium">{format(createdAt)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Last Updated
              </p>
              <p className="text-sm font-medium">{format(updatedAt)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Creator View - No Participants Warning */}
          {isCreator && !hasParticipants && (
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 space-y-3">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100">
                    No Participants Yet
                  </h4>
                  <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                    You must add at least one participant to this project before
                    students can access it.
                  </p>
                </div>
              </div>
              <AddParticipantsSheet projectId={projectId} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
