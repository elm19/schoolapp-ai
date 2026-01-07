"use client";
import { Button } from "@/components/ui/button";
import { BookmarkIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { CourseSettingsSheet } from "./course-settings-sheet";
import { useState } from "react";
export interface courseEnrollment {
  profiles: {
    username: string;
    id: string;
    email: string;
    status?: "pending" | "accepted" | "rejected";
  };
}

type Props = {
  onGenerate?: () => void;
  downloadHref?: string;
  courseOverview: string;
  content?: string;
  course_id: number;
  userType: string;
  isJoinedInitial?: boolean;
  courseName: string;
  courseDescription?: string;
  courseStatus: "ongoing" | "archived";
  participants: courseEnrollment[];
  isPublic: boolean;
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
  participants,
  isPublic,
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
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between w-full">
      <div className="flex items-center justify-between gap-3 w-full">
        <a href={downloadHref} download className="inline-block">
          <Button variant="secondary" className="w-full sm:w-auto">
            Download Materials
          </Button>
        </a>

        {userType === "teacher" && (
          <CourseSettingsSheet
            courseId={course_id}
            courseName={courseName || ""}
            courseDescription={courseDescription || ""}
            courseStatus={courseStatus}
            participants={participants}
            isPublicInitial={isPublic}
          />
        )}
      </div>

      {userType === "student" ? (
        <Button
          disabled={loading}
          variant="outline"
          onClick={onGenerateOnEnroll}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          {loading ? (
            <Spinner />
          ) : (
            <BookmarkIcon
              className={isJoined ? "fill-blue-500 stroke-blue-500" : ""}
            />
          )}
          {isJoined ? "Enrolled" : "Enroll"}
        </Button>
      ) : (
        <Button
          disabled={loading}
          onClick={onGenerateOnEnroll}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          {loading && <Spinner />}
          Generate Quiz
        </Button>
      )}
    </div>
  );
};
