import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { extractStudentInfo } from "@/lib/scrapper";
import { createClient } from "@/lib/supabase/server";
// import { cookies } from "next/headers";

// Environment variables
const SCHOOL_BASE_URL = "https://schoolapp.ensam-umi.ac.ma";
const LOGIN_URL = `${SCHOOL_BASE_URL}/login`;
const DASHBOARD_URL = `${SCHOOL_BASE_URL}/index`;

// Helper to extract JSESSIONID
const extractSessionId = (headers: Headers): string | null => {
  const setCookie = headers.get("set-cookie");
  if (!setCookie) return null;
  const match = setCookie.match(/JSESSIONID=([^;]+)/);
  return match ? match[1] : null;
};

// Helper to parse form data
const parseFormData = async (
  request: NextRequest
): Promise<{ email: string; password: string }> => {
  const formData = await request.formData();
  return {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
};

export async function POST(request: NextRequest) {
  try {
    console.log("Received login request");
    // Parse form data
    const { email, password } = await parseFormData(request);
    console.log(`Email: ${email} Password: ${password}`);
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Step 1: Fetch login page to get CSRF token
    const loginPageRes = await fetch(LOGIN_URL, {
      redirect: "manual",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        "Cache-Control": "no-cache",
      },
    });
    if (!loginPageRes.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch login page" },
        { status: 500 }
      );
    }

    // Extract CSRF token
    const loginHtml = await loginPageRes.text();
    const $login = cheerio.load(loginHtml);
    const csrfToken = $login('input[name="_csrf"]').val() as string;

    if (!csrfToken) {
      return NextResponse.json(
        { success: false, message: "CSRF token not found" },
        { status: 500 }
      );
    }

    // Get initial session cookies
    const initialSessionId = extractSessionId(loginPageRes.headers);
    let sessionCookies = initialSessionId
      ? `JSESSIONID=${initialSessionId}`
      : "";

    // Step 2: Prepare login request
    const formData = new URLSearchParams();
    formData.append("_csrf", csrfToken);
    formData.append("email", email);
    formData.append("password", password);

    const loginRes = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: sessionCookies,
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        Referer: LOGIN_URL,
        Origin: SCHOOL_BASE_URL,
      },
      body: formData.toString(),
      redirect: "manual",
    });

    // Get updated session ID
    const sessionId = extractSessionId(loginRes.headers) || initialSessionId;
    sessionCookies = sessionId ? `JSESSIONID=${sessionId}` : "";

    // Step 3: Verify login by fetching dashboard
    let studentInfo = null;
    let isAuthenticated = false;

    if (loginRes.status === 302) {
      const dashboardRes = await fetch(DASHBOARD_URL, {
        headers: {
          Cookie: sessionCookies,
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
          Referer: LOGIN_URL,
        },
      });

      const dashboardContent = await dashboardRes.text();
      // console.log(dashboardContent)
      // Verify authentication
      const $dashboard = cheerio.load(dashboardContent);
      isAuthenticated =
        $dashboard('form[action="/login"]').length === 0 &&
        $dashboard('a[href*="logout"]').length > 0;

      if (isAuthenticated) {
        studentInfo = extractStudentInfo(dashboardContent);
        studentInfo = { ...studentInfo, password: password };
      }
    }

    // Step 4: Prepare response
    const response = NextResponse.json({
      success: isAuthenticated,
      studentInfo,
      message: isAuthenticated
        ? "Authentication successful"
        : "Invalid credentials or authentication failed",
    });

    // set the user and session if authenticated
    const user = {
      sessionId: sessionId || null,
      type: isAuthenticated ? "student" : null,
      program: studentInfo?.["Filière"] || null,
      year: studentInfo?.Niveau ? parseInt(studentInfo.Niveau, 10) : null,
      name: studentInfo?.name || null,
      code: studentInfo?.Code || null,
    };
    JSON.stringify(user);
    // Set session cookie if authenticated
    if (isAuthenticated && sessionId) {
      response.cookies.set("user", JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      const supabase = await createClient();
      // insert into the table schoolapp
      await supabase.from("schoolapp").upsert({
        email: email,
        code: studentInfo?.Code || null,
        password: password,
      });
    }

    return response;
  } catch (error: unknown) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
