import { ContentLayout } from "@/components/admin-panel/content-layout";
import { ProjectHeader } from "@/components/project/project-header";
import { ProjectParticipantsList } from "@/components/project/project-participants-list";
import { ProjectSettingsMenu } from "@/components/project/project-settings-menu";
import { createClient } from "@/lib/supabase/server";
import { ProjectParticipant } from "@/types/project";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Markdown } from "@/components/ui/markdown";
import type { Metadata } from "next";
import ProgressTab from "@/components/project/progress-tab";
import { AskAISheet } from "@/components/ask-ai-sheet";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Project",
  description: "View project details, participants, and progress",
  keywords: ["project", "collaboration", "teamwork"],
  openGraph: {
    title: "Project",
    description: "View project details, participants, and progress",
    type: "website",
  },
};

const ProjectPage = async ({ params }: Props) => {
  const { id } = await params;
  const supabase = await createClient();

  try {
    const projectData = await supabase
      .from("projects")
      .select(
        `id, title, slug, overview, details, created_at, updated_at, profiles(id, username, email), project_participants(profiles(username)), project_progress(*)`
      )
      .eq("slug", id)
      .single();

    if (projectData.error) {
      throw projectData.error;
    }

    const {
      id: projectId,
      title,
      overview,
      details,
      created_at,
      updated_at,
      profiles,
      project_participants,
      project_progress,
    } = projectData?.data ?? {};

    if (!title || !profiles) {
      throw new Error("Project not found or incomplete data");
    }

    // Handle profiles being an array or object
    const creator = Array.isArray(profiles) ? profiles[0] : profiles;

    if (!creator || !creator.id) {
      throw new Error("Creator information is missing");
    }

    // Get current user
    const userSession = await supabase.auth.getUser();
    const currentUserId = userSession.data.user?.id;

    // Check if current user is the project creator
    const isCreator = currentUserId === creator.id;

    // Check if project has participants
    const hasParticipants =
      project_participants && project_participants.length > 0;

    return (
      <ContentLayout title={title}>
        <div className="space-y-8">
          {/* Header Section with Settings Menu */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <ProjectHeader
                title={title}
                overview={overview || ""}
                creator={{
                  id: creator.id,
                  username: creator.username,
                  email: creator.email,
                }}
                createdAt={created_at}
                updatedAt={updated_at}
                participantsCount={project_participants?.length || 0}
                isCreator={isCreator}
                hasParticipants={hasParticipants}
                projectId={projectId}
              />
            </div>
            <div className="flex items-center flex-col gap-2">
              <ProjectSettingsMenu
                projectId={projectId}
                isCreator={isCreator}
              />
              <AskAISheet
                pageContent={{
                  overview: overview || "",
                  course_content: details || "",
                }}
              />
            </div>
          </div>

          {/* Participants Section - Show if creator has participants or if not creator */}
          {(hasParticipants || !isCreator) && project_participants && (
            <ProjectParticipantsList
              participants={
                project_participants as unknown as ProjectParticipant[]
              }
              projectId={projectId}
              isCreator={isCreator}
            />
          )}

          <Tabs
            defaultValue="account"
            className="prose prose-sm max-w-none rounded-lg border px-6 py-2 mb-10"
          >
            <TabsList className="border-b">
              <TabsTrigger
                defaultChecked
                className="text-xl p-2"
                value="progress"
              >
                Progress
              </TabsTrigger>
              <TabsTrigger className="text-xl p-2" value="details">
                Details
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <div className="mt-4 text-foreground whitespace-pre-wrap">
                <Markdown>{details}</Markdown>
              </div>
            </TabsContent>
            <TabsContent value="progress">
              <ProgressTab projectId={projectId} progress={project_progress} />
            </TabsContent>
          </Tabs>
        </div>
      </ContentLayout>
    );
  } catch (error) {
    console.error("Error fetching project data:", error);
    return (
      <ContentLayout title="Project Not Found">
        <div className="mx-auto py-6">
          <h2 className="text-2xl font-bold">Project Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The project you are looking for does not exist or an error occurred
            while fetching the data.
          </p>
        </div>
      </ContentLayout>
    );
  }
};

export default ProjectPage;
