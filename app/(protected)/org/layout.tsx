import { ContentLayout } from "@/components/admin-panel/content-layout";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";

export default async function OrgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is connected to a platform
  const stringfiedData = (await cookies()).get("user")?.value;

  if (!stringfiedData) {
    return (
      <ContentLayout title={"Organization"}>
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle>No Platform Connected</CardTitle>
              <CardDescription>
                You are currently not connected to any platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/settings">
                <Button className="w-full">Go to Settings</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </ContentLayout>
    );
  }

  return <>{children}</>;
}
