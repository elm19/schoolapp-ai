import { ContentLayout } from "@/components/admin-panel/content-layout";
import { ProjectGrid } from "@/components/project/project-grid";
import type { UserType, Project } from "@/types/project";
import { createClient } from "@/lib/supabase/server";
import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore and manage collaborative projects. Create new projects and track project progress.",
  keywords: ["projects", "collaboration", "teamwork"],
  openGraph: {
    title: "Projects",
    description: "Explore and manage collaborative projects",
    type: "website",
  },
};

type SearchParams = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ProjectListPage = async ({ searchParams }: SearchParams) => {
  const filters = await searchParams;
  const searchQuery = filters.search ? filters.search.toString() : "";
  const supabase = await createClient();
  const userType = (await supabase.auth.getUser()).data.user?.user_metadata
    ?.type as UserType | undefined;

  console.log("Current user type:", userType);

  const { data: projectsData, error } = await supabase
    .from("projects")
    .select(
      `id, title, created_at, overview, updated_at, slug, created_by!inner(username), project_participants(profiles(username))`
    )
    .ilike("title", `%${searchQuery}%`);

  if (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }

  // Transform the data to match Project type
  const projects: Project[] | null = projectsData
    ? projectsData.map((project) => ({
        id: project.id as string,
        title: project.title as string,
        created_at: project.created_at as string,
        overview: project.overview as string,
        slug: project.slug as string,
        updated_at: project.updated_at as string,
        created_by: Array.isArray(project.created_by)
          ? (project.created_by[0] as { username: string })
          : (project.created_by as { username: string }),
        project_participants: (((project.project_participants as unknown) ||
          []) as Array<{
          profiles: { username: string };
        }>)
          ? (project.project_participants as unknown as Array<{
              profiles: { username: string };
            }>)
          : [],
      }))
    : null;

  console.log("Fetched projects:", projects);

  return (
    <ContentLayout title="Projects">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {userType === "teacher" && (
            <Link href="/projects/new">
              <Button>Start New Project</Button>
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <SearchInput currentPathname="/projects" />

        {/* Projects Grid */}
        <ProjectGrid projects={projects} userType={userType} />
      </div>
    </ContentLayout>
  );
};

export default ProjectListPage;
