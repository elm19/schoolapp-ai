import { NextRequest, NextResponse } from "next/server";
import { extractStudentInfo } from "@/lib/scrapper";
import { visitUrl } from "@/lib/utils";

// Environment variables
const SCHOOL_BASE_URL = "https://schoolapp.ensam-umi.ac.ma";
const DASHBOARD_URL = `${SCHOOL_BASE_URL}/index`;

export async function GET(request: NextRequest) {
  try {
    const stringfiedData = request.cookies.get("user")?.value;
    if(stringfiedData === undefined) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }
    const user = JSON.parse(stringfiedData);
    const sessionId = user.sessionId;
    const res = await visitUrl({
      toVisiteUrl: DASHBOARD_URL,
      returnContent: true,
      sessionId: sessionId,
    });
    if (!res || typeof res === "boolean") {
      return NextResponse.json(
        { success: false, message: "Session expired or invalid" },
        { status: 401 }
      );
    }
    // Extract student info
    const studentInfo = extractStudentInfo(res.data);

    return NextResponse.json({
      success: true,
      studentInfo
    });
  } catch (error: unknown) {
    console.error("Student data error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
