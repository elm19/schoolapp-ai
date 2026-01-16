import { ContentLayout } from "@/components/admin-panel/content-layout";
import SearchInput from "@/components/search-input";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, User, UserCheck, Sparkles } from "lucide-react";
import Link from "next/link";

type SearchParams = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

interface UserProfile {
  id: string;
  username: string;
  email: string;
  type: "student" | "teacher";
  created_at: string;
}

export default async function UsersPage({ searchParams }: SearchParams) {
  const filters = await searchParams;
  const query = filters.search ? String(filters.search) : "";
  if (query.length > 50) {
    return (
      <ContentLayout title="Users">
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Search query is too long. Please limit to 50 characters.
          </p>
        </div>
      </ContentLayout>
    );
  }
  console.log("Search query:", query);
  if (query.length < 3) {
    return (
      <ContentLayout title="Users">
        <div className="space-y-8">
          {/* Header Section with Your Profile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Section */}
            <div className="md:col-span-2">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <SearchInput currentPathname="/users" />
                <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Type at least 3 characters to search users
                </p>
              </div>
            </div>

            {/* Your Profile Card */}
            <Link href="/users/me">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-6 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col items-center justify-center text-center">
                <UserCheck className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  Your Profile
                </h3>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  View your profile
                </p>
              </div>
            </Link>
          </div>

          {/* Empty State Section */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center max-w-md">
              <div className="mb-6 flex justify-center">
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-950 dark:to-blue-950 p-6 rounded-full">
                  <Sparkles className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Search for Users</h2>
              <p className="text-muted-foreground mb-6">
                Start searching to explore the community and connect with
                students and teachers
              </p>
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  💡 Search Tips:
                </p>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Search by username (e.g., &quot;john&quot;)</li>
                  <li>
                    • Search by email (e.g., &quot;john@example.com&quot;)
                  </li>
                  <li>• Use at least 3 characters for best results</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ContentLayout>
    );
  }

  const supabase = await createClient();

  // Search by username or email
  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, username, email, type, created_at")
    .or(`username.ilike.%${query}%,email.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <ContentLayout title="Users">
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Failed to load users. Please try again later.
          </p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Users">
      <div className="space-y-8">
        {/* Header Section with Your Profile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Section */}
          <div className="md:col-span-2">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <SearchInput currentPathname="/users" />
              <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Search users by username or email
              </p>
            </div>
          </div>

          {/* Your Profile Card */}
          <Link href="/users/me">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-6 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col items-center justify-center text-center">
              <UserCheck className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                Your Profile
              </h3>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                View your profile
              </p>
            </div>
          </Link>
        </div>

        {/* Users List Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {users && users.length > 0
                ? `Found ${users.length} user${users.length !== 1 ? "s" : ""}`
                : "No users found"}
            </h2>
          </div>

          {!users || users.length === 0 ? (
            <Card>
              <CardContent className="pt-8 pb-8">
                <div className="text-center">
                  <User className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                  <p className="text-muted-foreground">
                    {query
                      ? `No users found matching "${query}"`
                      : "No users available"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user: UserProfile) => (
                <Link key={user.id} href={`/users/${user.username}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">
                            {user.username}
                          </CardTitle>
                          <CardDescription className="truncate">
                            {user.email}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            user.type === "teacher" ? "default" : "secondary"
                          }
                          className="ml-2 flex-shrink-0"
                        >
                          {user.type === "teacher"
                            ? "👨‍🏫 Teacher"
                            : "👤 Student"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="text-blue-600 hover:underline truncate">
                          {user.email}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>
                          Joined{" "}
                          {new Date(user.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
}
