import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Example: /api/userphoto?userCode=M19212
export async function GET(request: NextRequest) {
  let { sessionId, code } = JSON.parse(request.cookies.get("user")?.value || "");
  if (!sessionId || !code) {
    ({ sessionId, code } = JSON.parse(
      (await cookies()).get("user")?.value || ""
    ));
  }
  if (!sessionId || !code) {
    return new NextResponse("Missing session or user code", { status: 400 });
  }

  // Build the real image URL (adjust as needed for your backend)
  const SCHOOL_BASE_URL =
    process.env.SCHOOL_BASE_URL || "https://schoolapp.ensam-umi.ac.ma";
  const imageUrl = `${SCHOOL_BASE_URL}/getphoto/${code}`;

  // Fetch the image with the session cookie
  const imageRes = await fetch(imageUrl, {
    headers: {
      Cookie: `JSESSIONID=${sessionId}`,
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!imageRes.ok) {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }

  // Stream the image back to the client
  const contentType = imageRes.headers.get("content-type") || "image/jpeg";
  const imageBuffer = await imageRes.arrayBuffer();
  return new NextResponse(Buffer.from(imageBuffer), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
