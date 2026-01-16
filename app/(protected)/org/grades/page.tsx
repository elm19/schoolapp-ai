import { ContentLayout } from "@/components/admin-panel/content-layout";
import BreadcrumbOrg from "@/components/BreadcrumbOrg";
import MarksTable from "@/components/project/mark-table";
import { extractMarks } from "@/lib/scrapper";
import { visitUrl } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const GradesPage = async () => {
  const stringfiedData = (await cookies()).get("user")?.value;
  const user = JSON.parse(stringfiedData ? stringfiedData : "{}");
  const sessionId = user.sessionId;
  if (!sessionId) {
    redirect("/login");
  }
  const res = await visitUrl({
    toVisiteUrl: "https://schoolapp.ensam-umi.ac.ma/student/noteselem-encours",
    returnContent: true,
    sessionId: sessionId,
  });
  if (!res || typeof res === "boolean") {
    return <div>No student info available.</div>;
  }
  const grades = extractMarks(res.data);

  return (
    <ContentLayout title={"grades"}>
      <BreadcrumbOrg title={"Grades"} href={"/org/grades"} />
      <MarksTable grades={grades} />
    </ContentLayout>
  );
};
export default GradesPage;
