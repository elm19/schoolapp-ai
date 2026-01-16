import Link from "next/link";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import SearchInput from "@/components/search-input";
import { createClient } from "@/lib/supabase/server";
import { format } from "timeago.js";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Courses",
  description:
    "Browse and manage your enrolled courses. Create new courses and view course details.",
  keywords: ["courses", "learning", "education"],
  openGraph: {
    title: "My Courses",
    description: "Browse and manage your enrolled courses",
    type: "website",
  },
};

type SearchParams = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export default async function MyCoursesPage({ searchParams }: SearchParams) {
  const filters = await searchParams;
  const searchQuery = filters.search ? filters.search.toString() : "";

  const supabase = await createClient();
  // select from the courses table in supabase
  const user = (await supabase.auth.getUser()).data.user;
  const { data: courses, error } = await supabase
    .from("courses")
    .select(`id, title, created_at, profiles(username)`)
    .ilike("title", `%${searchQuery}%`)
    .eq("created_by", user?.id || 0);

  if (error) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to fetch courses");
  }
  return (
    <ContentLayout title="Courses">
      <div className="max-w-6xl mx-auto px-0 md:px-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 w-full max-w-2xl">
            <SearchInput currentPathname="/courses" />
          </div>

          <div className="flex justify-between w-full md:w-auto md:items-center md:gap-2">
            <Link
              href="/courses/new"
              className="text-sm font-medium text-primary hover:underline"
            >
              <Button variant="outline" size="sm">
                New Course
              </Button>
            </Link>
            <Link href={"/courses"}>
              <Button variant="ghost" size="sm">
                Explore
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses
            .slice()
            .reverse()
            .map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex flex-col items-start justify-between gap-4">
                    <div>
                      <CardTitle>{course.title}</CardTitle>
                    </div>
                    <div className="flex  justify-between w-full">
                      <div className="text-sm">
                        <div className="font-medium">
                          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                          {/* @ts-ignore */}
                          By {course.profiles?.username}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                          {/* @ts-ignore */}
                          {course.participants || 12} participants
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="relative p-2 rounded-md hover:bg-accent">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                              </svg>
                              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                              {/* @ts-ignore */}
                              {course.notifications > 0 && (
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-destructive text-white text-xs w-5 h-5">
                                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                  {/* @ts-ignore */}
                                  {course.notifications}
                                </span>
                              )}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent sideOffset={4}>
                            Notifications
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardFooter className="justify-between">
                  <div className="text-sm text-muted-foreground">
                    {format(course.created_at)}
                  </div>
                  <Link
                    href={`/courses/${course.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View More →
                  </Link>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </ContentLayout>
  );
}
