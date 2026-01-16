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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cookies } from "next/headers";

const OrgPage = async () => {
  // Placeholder data
  const stringfiedData = (await cookies()).get("user")?.value;
  const user = JSON.parse(stringfiedData ? stringfiedData : "{}");

  const userName = user.name;
  const userCode = user.code ;
  const userOrg = "Ensam Meknes School";

  const subpages = [
    { id: "info", label: "Org Info", description: "View organization details" },
    {
      id: "absence",
      label: "Absence",
      description: "Track attendance and absences",
      disabled: false,
    },
    { id: "grades", label: "Grades", description: "View your grades", disabled: false},
    {
      id: "document", label: "Document", description: "Access documents" , disabled: true
    },
    {
      id: "calculator",
      label: "Calculator",
      description: "Use the calculator tool",
      disabled: true,
    },
    {
      id: "calendar",
      label: "Calendar",
      description: "View the school calendar",
      disabled: true,
    },
  ];

  return (
    <ContentLayout title={"Organization"}>
      {/* User Info Section */}
      <div className="mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`/api/userphoto`} alt="User photo" />
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{userName}</CardTitle>
              <CardDescription className="text-base">
                <p>Code: {userCode}</p>
                <p>Organization: {userOrg}</p>
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Navigation Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Quick Access</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subpages.map((page) => (
            <Link key={page.id} href={`/org/${page.id}`}>
              <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">{page.label}</CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" disabled={page.disabled}>
                    Access
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </ContentLayout>
  );
};

export default OrgPage;
