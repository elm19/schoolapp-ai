import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CourseHeader } from "@/components/course/course-header";
import { CourseActions } from "@/components/course/course-actions";
import { AnnouncementsSection } from "@/components/course/announcements-section";
import { QuizzesSection } from "@/components/course/quizzes-section";
import { DownloadSupport } from "@/components/course/download-support";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Course",
  description: "View course details, announcements, and quizzes",
  keywords: ["course", "learning", "education"],
  openGraph: {
    title: "Course",
    description: "View course details, announcements, and quizzes",
    type: "website",
  },
};

const CoursePage = async ({ params }: Props) => {
  const { id } = await params;
  const supabase = await createClient();

  try {
    const courseData = await supabase
      .from("courses")
      .select(
        `*,profiles(username), announcements(*), quizzes(*), course_enrollments(profiles(username, id, email))`
      )
      .eq("id", id)
      .single();
    console.log("Course Data:", courseData);
    if (courseData.error) {
      throw courseData.error;
    }

    const {
      title,
      overview,
      text_content,
      created_at,
      profiles,
      announcements,
      quizzes,
      course_enrollments,
      file_url,
      is_public,
    } = courseData?.data ?? null;
    if (title === undefined) {
      throw new Error("Course not found or incomplete data");
    }
    const user = await supabase.auth.getUser();
    const isJoinedInitial = course_enrollments.some(
      (item: { profiles: { id: string } }) =>
        item.profiles.id === user.data.user?.id
    );

    const isStudent = user.data.user?.user_metadata?.type === "student";
    const shouldShowAlert = isStudent && !isJoinedInitial;

    return (
      <ContentLayout title={title}>
        <div className="mx-auto py-6 space-y-6">
          <CourseHeader
            title={title}
            overview={overview}
            createdAt={created_at}
            creator={profiles.username}
            participantsCount={course_enrollments.length}
          />

          <div className="items-center grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CourseActions
                courseOverview={overview}
                course_id={parseInt(id)}
                courseName={title}
                courseDescription={overview}
                courseStatus={"ongoing"}
                // onGenerate={handleGenerate}
                downloadHref={file_url}
                content={text_content}
                userType={user.data.user?.user_metadata?.type}
                isJoinedInitial={isJoinedInitial}
                participants={course_enrollments}
                isPublic={is_public}
                shouldShowAlert={shouldShowAlert}
              />
            </div>
          </div>

          {!shouldShowAlert && (
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
              </div>
            </div>
          )}
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
