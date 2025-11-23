"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  FilePlus,
  FileText,
  CheckCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const NewCourse = () => {
  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // log the payload for now
    // const payload = {
    //   title,
    //   overview,
    //   pdf: pdfFile
    //     ? { name: pdfFile.name, size: pdfFile.size, type: pdfFile.type }
    //     : null,
    // };

    try {
      const supabase = createClient();
      const user = await supabase.auth.getUser();

      const response = await supabase.from("courses").insert([
        {
          title: title,
          overview: overview,
          created_by: user.data.user?.id as string,
        },
      ]);
        
        

    //   console.log(response);
      if ((response as unknown as { error?: { message?: string } }).error) {
        throw new Error(
          (response as unknown as { error?: { message?: string } }).error
            ?.message || "Failed to create course"
        );
      }

      // success: animate out form and show success message
        setSuccess(true);
        router.push("/courses");
    } catch (err) {
      console.error(err);
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as Error).message
          : String(err);
      setError(message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentLayout title="New Course">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="m-0">Create a new course</CardTitle>
              </div>
              <CardDescription className="mt-1">
                Short and modern form to add course details and optional PDF
                support.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {/* success / error banners */}
            <div className="min-h-[56px]">
              {success ? (
                <div className="flex items-center gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Course created</div>
                    <div className="text-sm text-muted-foreground">
                      The course was created successfully.
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center gap-3 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <div>
                    <div className="font-medium">Error</div>
                    <div className="text-sm text-destructive">{error}</div>
                  </div>
                </div>
              ) : null}
            </div>

            <div
              className="transition-all duration-400 ease-in-out"
              style={{
                opacity: success ? 0 : 1,
                transform: success ? "scale(0.98) translateY(-8px)" : "none",
              }}
            >
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <span className="sr-only">Course title</span>
                    <span className="text-sm font-medium">Title</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="title"
                      placeholder="Introduction to Algebra"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="pl-3"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="overview" className="flex items-center gap-2">
                    <span className="text-sm font-medium">Overview</span>
                  </Label>
                  <textarea
                    id="overview"
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    className="w-full min-h-[120px] resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="A short, 1-2 sentence summary of the course"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="flex items-center justify-between">
                    <span className="text-sm font-medium">Support file</span>
                    <span className="text-xs text-muted-foreground">
                      PDF only
                    </span>
                  </Label>

                  <label
                    htmlFor="pdf"
                    className="inline-flex items-center gap-2 rounded-md border border-dashed border-input px-3 py-2 text-sm text-muted-foreground hover:border-border hover:bg-accent/50 cursor-pointer"
                  >
                    <FilePlus className="h-4 w-4" />
                    <span>
                      {pdfFile ? pdfFile.name : "Upload PDF (optional)"}
                    </span>
                  </label>
                  <input
                    id="pdf"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      setPdfFile(
                        e.target.files && e.target.files[0]
                          ? e.target.files[0]
                          : null
                      )
                    }
                    className="sr-only"
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTitle("");
                  setOverview("");
                  setPdfFile(null);
                  setError(null);
                  setSuccess(false);
                }}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || success}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Create course"
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </ContentLayout>
  );
};

export default NewCourse;
