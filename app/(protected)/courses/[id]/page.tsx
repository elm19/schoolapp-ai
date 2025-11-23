import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CourseHeader } from "@/components/course/course-header";
import { CourseActions } from "@/components/course/course-actions";
import { AnnouncementsSection } from "@/components/course/announcements-section";
import { QuizzesSection } from "@/components/course/quizzes-section";
import { DownloadSupport } from "@/components/course/download-support";
import { ParticipantsCounter } from "@/components/course/participants-counter";
import { createClient } from "@/lib/supabase/server";
type Props = { params: Promise<{ id: string }>};

const CoursePage = async ({ params }: Props) => {

  const { id } = await params;
  const supabase = await createClient();

  try {
    const courseData = await supabase
      .from("courses")
      .select(`*,profiles(username), announcements(*), quizzes(*)`)
      .eq("id", id)
      .single();
    if (courseData.error) {
      throw courseData.error;
    }
    const { title, overview, created_at, profiles, announcements, quizzes } =
      courseData?.data ?? null;
    if (title === undefined) {
      throw new Error("Course not found or incomplete data");
    }
    
    return (
      <ContentLayout title={title}>
        <div className="mx-auto py-6 space-y-6">
          <CourseHeader
            title={title}
            overview={overview}
            createdAt={created_at}
            creator={profiles.username}
          />

          <div className="max-w-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ParticipantsCounter count={123} />
            </div>
            <div className="flex items-center gap-2">
              <CourseActions
                courseOverview={overview}
                course_id={parseInt(id)}
                // onGenerate={handleGenerate}
                downloadHref={"/"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <AnnouncementsSection
                course_id={parseInt(id)}
                announcements={announcements}
              />
              <QuizzesSection quizzes={quizzes} />
            </div>

            <div className="space-y-4">
              <DownloadSupport href={"/"} />
              <div className="p-4 rounded-md border">
                <h4 className="font-medium">Settings</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Course settings and permissions
                </p>
                <div className="mt-3">
                  <a className="text-sm text-primary underline">
                    Open settings
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentLayout>
    );
  } catch (error) {
    console.error("Error fetching course data:", error);
    return (
      <ContentLayout title="Course Not Found">
        <div className="mx-auto py-6">
          <h2 className="text-2xl font-bold">Course Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The course you are looking for does not exist or an error occurred
            while fetching the data.
          </p>
        </div>
      </ContentLayout>
    );
  }
};

export default CoursePage;
