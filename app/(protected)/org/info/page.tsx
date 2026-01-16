import { cookies } from "next/headers";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { visitUrl } from "@/lib/utils";
import { extractStudentInfo } from "@/lib/scrapper";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const OrgInfoPage = async () => {
  const stringfiedData = (await cookies()).get("user")?.value;
  const user = JSON.parse(stringfiedData ? stringfiedData : "{}");
  const sessionId = user.sessionId;
  const res = await visitUrl({
    toVisiteUrl: "https://schoolapp.ensam-umi.ac.ma/index",
    returnContent: true,
    sessionId: sessionId,
  });
  if (!res || typeof res === "boolean") {
    return <div>No student info available.</div>;
  }
  const studentInfo = extractStudentInfo(res.data);

  return (
    <ContentLayout title={"Student Information"}>
      {/* Student Profile Header */}
      <div className="mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-6">
            <Avatar className="h-24 w-24 flex-shrink-0">
              <AvatarImage src={`/api/userphoto`} alt="Student photo" />
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-3xl">
                {studentInfo?.name || user?.name || "N/A"}
              </CardTitle>
              <CardDescription className="text-base space-y-2 mt-2">
                <p>
                  <strong>Code:</strong>{" "}
                  {studentInfo?.code || user?.code || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {studentInfo?.Email || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong> {studentInfo?.["Téléphone"] || "N/A"}
                </p>
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Academic Information */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Program</p>
                <p className="text-base">{studentInfo?.["Filière"] || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Level</p>
                <p className="text-base">{studentInfo?.Niveau || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Section</p>
                <p className="text-base">{studentInfo?.Section || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Group</p>
                <p className="text-base">{studentInfo?.Groupe || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Status</p>
                <p className="text-base">{studentInfo?.Statut || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Sub Group</p>
                <p className="text-base">
                  {studentInfo?.["Sous Groupe"] || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Full Name</p>
                <p className="text-base">
                  {studentInfo?.["Prénom"]} {studentInfo?.Nom}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">CIN</p>
                <p className="text-base">{studentInfo?.CIN || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Gender</p>
                <p className="text-base">{studentInfo?.Sexe || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">DOB</p>
                <p className="text-base">
                  {studentInfo?.["Date Naissance"] || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">
                  Nationality
                </p>
                <p className="text-base">
                  {studentInfo?.["Nationalité"] || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">CNE/Masar</p>
                <p className="text-base">
                  {studentInfo?.["CNE/Masar"] || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admission Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Admission Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">
                  Access Level
                </p>
                <p className="text-base">
                  {studentInfo?.["Niveau Accès"] || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">
                  Access Year
                </p>
                <p className="text-base">
                  {studentInfo?.["Annee Accès"] || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">
                  Access Method
                </p>
                <p className=" text-sm">
                  {studentInfo?.["Voie Accès"] || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Baccalaureate Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Baccalaureate Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Series</p>
                <p className="text-base">
                  {studentInfo?.["Série BAC"] || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Year</p>
                <p className="text-base">
                  {studentInfo?.["Année BAC"] || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
};
export default OrgInfoPage;
