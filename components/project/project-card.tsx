"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Project, UserType } from "@/types/project";
import { format } from "timeago.js";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
  userType: UserType;
}

export const ProjectCard = ({ project, userType }: ProjectCardProps) => {
  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <Link href={`/projects/${project.slug}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {project.overview}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Link>

        <CardContent className="space-y-4">
          {/* Teacher Info - Only show for students */}
          {userType === "student" && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Instructor
              </p>
              <Link
                href={`/users/${project.created_by.username}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {getInitials(project.created_by.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {project.created_by.username}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Students List - Only show for teachers */}
          {userType === "teacher" && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Participants ({project.project_participants.length})
              </p>
              {project.project_participants.length > 0 ? (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {project.project_participants.map((participant, idx) => (
                    <Link
                      key={idx}
                      href={`/users/${participant.profiles.username}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                        <Avatar className="h-6 w-6">
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
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No participants yet
                </p>
              )}
            </div>
          )}

          {/* Last Updated */}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Updated{" "}
              <span className="font-medium">{format(project.updated_at)}</span>
            </p>
            <Link
              href={`/projects/${project.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm text-primary hover:underline"
            >
              View Project
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
