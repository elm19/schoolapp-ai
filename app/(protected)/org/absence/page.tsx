import { ContentLayout } from "@/components/admin-panel/content-layout";
import BreadcrumbOrg from "@/components/BreadcrumbOrg";
import { AbsenceDisplay } from "@/components/org/absence-display";
import { extractAbsenceSummary } from "@/lib/scrapper";
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
    toVisiteUrl: "https://schoolapp.ensam-umi.ac.ma/student/absence/bilan",
    returnContent: true,
    sessionId: sessionId,
  });
  if (!res || typeof res === "boolean") {
    return <div>No student info available.</div>;
  }
  const absence = extractAbsenceSummary(res.data);
  console.log(absence);
  return (
    <ContentLayout title={"Absence"}>
      <BreadcrumbOrg title={"Absence"} href={"/org/absence"} />
      <div className="mt-6">
        <AbsenceDisplay total={absence.total} elements={absence.elements} />
      </div>
    </ContentLayout>
  );
};

export default GradesPage;
