"use client";
import { Button } from "@/components/ui/button";
import { BookmarkIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { CourseSettingsSheet } from "./course-settings-sheet";
import { useState } from "react";
// import { Toggle } from "../ui/toggle";

type Props = {
  onGenerate?: () => void;
  downloadHref?: string;
  courseOverview: string;
  content?: string;
  course_id: number;
  userType?: string;
  isJoinedInitial?: boolean;
  courseName?: string;
  courseDescription?: string;
  courseStatus?: "ongoing" | "archived";
};

export const CourseActions = ({
  downloadHref,
  courseOverview,
  content,
  course_id,
  userType,
  isJoinedInitial,
  courseName,
  courseDescription,
  courseStatus,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isJoined, setIsJoined] = useState(isJoinedInitial);

  console.log("I AM THE ERROR AT THE COURSE ACTIONS COMPONENT ", error);

  const onGenerateOnEnroll = async () => {
    const api = userType == "student" ? "/api/enroll-course" : "/api/gemini-ai";
    const payload =
      userType == "student"
        ? { course_id }
        : {
            prompt: content ? content : courseOverview,
            course_id,
            source: true,
          };

    setLoading(true);
    try {
      const res = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const response = await res.json();
      if (response.message) {
        if (userType == "student") {
          setIsJoined(true);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex gap-5">
      <div className="flex  gap-2">
        <a href={downloadHref} download className="inline-block">
          <Button variant="secondary">Download Materials</Button>
        </a>
        <div className="flex items-center gap-2">
          {userType === "teacher" && (
            <CourseSettingsSheet
              courseId={course_id}
              courseName={courseName}
              courseDescription={courseDescription}
              courseStatus={courseStatus}
            />
          )}
        </div>
      </div>
      {userType == "student" ? (
        <Button
          disabled={loading}
          variant={"outline"}
          // className={`${
          //   isJoined ? "bg-transparent fill-blue-500 stroke-blue-500" : ""
          // }`}
          onClick={onGenerateOnEnroll}
        >
          {loading ? (
            <Spinner />
          ) : (
            <BookmarkIcon
              className={`${
                isJoined ? "bg-transparent fill-blue-500 stroke-blue-500" : ""
              }`}
            />
          )}
          {isJoined ? "Enrolled" : "Enroll"}
        </Button>
      ) : (
        // </Button>
        <Button disabled={loading} onClick={onGenerateOnEnroll}>
          {loading && <Spinner />}
          Generate Quiz
        </Button>
      )}
    </div>
  );
};
