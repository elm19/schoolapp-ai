"use client";

import { Project, UserType } from "@/types/project";
import { ProjectCard } from "./project-card";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

interface ProjectGridProps {
  projects: Project[] | null;
  userType: string | undefined;
  isLoading?: boolean;
}

export const ProjectGrid = ({
  projects,
  userType,
  isLoading,
}: ProjectGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const projectList = projects || [];

  if (projectList.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No projects found</EmptyTitle>
          <EmptyDescription>
            Try adjusting your search criteria or create a new project to get
            started.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projectList.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          userType={(userType as UserType) || "student"}
        />
      ))}
    </div>
  );
};
