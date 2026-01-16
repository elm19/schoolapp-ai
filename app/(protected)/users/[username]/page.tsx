import { ContentLayout } from "@/components/admin-panel/content-layout";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, BookOpen, Users } from "lucide-react";
import Link from "next/link";

type Props = { params: Promise<{ username?: string }> };

export default async function UserProfilePage({ params }: Props) {
  const supabase = await createClient();

  const { username } = await params;

  const { data: userProfile } = await supabase
    .from("profiles")
    .select(
      `username, email, created_at, type, courses(id, title), course_enrollments(courses(id, title))`
    )
    .eq("username", username)
    .single();

  if (!userProfile) {
    return (
      <ContentLayout title="Profile">
        <div className="text-center py-12">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </ContentLayout>
    );
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <ContentLayout title="Profile">
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Please log in to view profiles
          </p>
        </div>
      </ContentLayout>
    );
  }

  // Get user type and courses from the fetched profile data
  const userType = userProfile.type || "student";

  interface Course {
    id: number;
    title: string;
  }

  // Get courses based on user type
  let userCourses: Course[] = [];
  if (userType === "teacher") {
    // For teachers, use courses array
    userCourses = (userProfile.courses as Course[]) || [];
  } else {
    // For students, use course_enrollments
    userCourses =
      (userProfile.course_enrollments as unknown as { courses: Course }[])
        ?.map((e: { courses: Course }) => e.courses)
        .filter(Boolean) || [];
  }

  // Get other users to explore
  const { data: otherUsers } = await supabase
    .from("profiles")
    .select("username, created_at")
    .neq("username", username)
    .limit(6)
    .order("created_at", { ascending: false });

  const joinedDate = userProfile.created_at
    ? new Date(userProfile.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  const userName = userProfile.username || "User";
  const email = userProfile.email || "No email";

  return (
    <ContentLayout title={`${userName}'s Profile`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl">{userName}</CardTitle>
                  <CardDescription className="mt-2">{email}</CardDescription>
                </div>
                <Badge
                  variant={userType === "teacher" ? "default" : "secondary"}
                >
                  {userType === "teacher" ? "👨‍🏫 Teacher" : "👤 Student"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact and Join Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm font-medium hover:underline text-blue-600"
                    >
                      {email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="text-sm font-medium">{joinedDate}</p>
                  </div>
                </div>
              </div>

              {/* Organization Info */}
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Organization
                    </p>
                    <p className="text-sm font-medium text-gray-500">
                      Not part of an organization
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courses Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {userType === "teacher" ? "Courses Created" : "Courses Joined"}
              </CardTitle>
              <CardDescription>
                {userType === "teacher"
                  ? `${userName}'s created courses`
                  : `${userName}'s enrolled courses`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userCourses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {userType === "teacher"
                      ? `${userName} hasn't created any courses yet`
                      : `${userName} hasn't joined any courses yet`}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userCourses.map((course: Course) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.id}`}
                      className="block"
                    >
                      <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <h4 className="font-semibold text-sm">
                          {course.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Explore Users */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Explore Users
              </CardTitle>
              <CardDescription>Other users on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {!otherUsers || otherUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No other users found
                </p>
              ) : (
                <div className="space-y-3">
                  {otherUsers.map(
                    (profile: { username: string; created_at: string }) => (
                      <Link
                        key={profile.username}
                        href={`/users/${profile.username}`}
                        className="block"
                      >
                        <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                          <p className="font-semibold text-sm">
                            {profile.username}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Joined{" "}
                            {new Date(profile.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentLayout>
  );
}
