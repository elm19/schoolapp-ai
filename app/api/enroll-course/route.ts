import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }    
    // check if the user is logged in
    const { course_id } = await req.json();
    if (!course_id) {
      return NextResponse.json(
        { error: "course Id is required" },
        { status: 400 }
      );
    }
      
    const {error, data}  = await supabase.from("course_enrollments").insert([
      {
        user_id: user.data.user.id,
        course_id: course_id,
      },
    ]);
      
    if (error) {
      throw error;
    } 
    return NextResponse.json({ message: "Enrolled successfully", data, status: 200 });
  } catch (error) {
    console.error("Error in Enrolling:", error);
    return NextResponse.json(
      { error: "Failed to Enroll in this course" },
      { status: 500 }
    );
  }
}