"use client";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

type Props = {
  onGenerate?: () => void;
  downloadHref?: string;
  courseOverview: string;
  course_id: number;
};

export const CourseActions = ({
  downloadHref,
  courseOverview,
  course_id,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  console.log(error);
  const onGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gemini-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: courseOverview,
          course_id,
          source: true,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const data = await res.json();
      console.log("Generated Quiz:", data.output);
      //   setResponse(data.output);

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
          <Button variant="outline" size="sm">
            <Settings />
          </Button>
        </div>
      </div>
      <Button disabled={loading} onClick={onGenerate}>
        {loading && <Spinner />}
        Generate Quiz
      </Button>
    </div>
  );
};
