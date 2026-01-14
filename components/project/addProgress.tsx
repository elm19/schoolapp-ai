"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AddProgress({ projectId }: { projectId: string}) {
  const [text, setText] = useState("");
  const router = useRouter();

  const saveAnnouncement = async () => {
    const supabase = createClient();

      try {
        console.log("Saving progress:", { text, projectId });
      const { data, error } = await supabase.from("project_progress").insert({
        content: text,
        project_id: projectId,
      });
        console.log("Progress saved successfully");
        console.log(data);
        if (error) {

            throw error;
        }
      router.refresh();
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <span className="md:block hidden">Add Progress</span>
          <PlusCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      {/* sm:max-w-[425px] */}
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Add An Progress</DialogTitle>
          <DialogDescription className="hidden">
            you can add progress to your project here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 h-30">
          <Textarea
            placeholder={`Write your progress here using Markdown syntax.
Examples:
# Title
- List item 1
- List item 2
**Bold text**`}
            className="h-40 sm:mb-0 mb-4"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={saveAnnouncement}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
