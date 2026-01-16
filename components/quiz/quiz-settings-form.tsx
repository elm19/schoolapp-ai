"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface QuizSettingsFormProps {
  quizId: string;
  title: string;
  availableFrom: string | null;
  availableTo: string | null;
}

export default function QuizSettingsForm({
  quizId,
  title,
  availableFrom,
  availableTo,
}: QuizSettingsFormProps) {
    const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    quizName: title,
    availableFrom: availableFrom
      ? new Date(availableFrom).toISOString().slice(0, 16)
      : "",
    availableTo: availableTo
      ? new Date(availableTo).toISOString().slice(0, 16)
      : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id === "quiz-name"
        ? "quizName"
        : id === "available-from"
        ? "availableFrom"
        : "availableTo"]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      // Prepare the update object
      const updateData = {
        available_from: formData.availableFrom
          ? new Date(formData.availableFrom).toISOString()
          : null,
        available_to: formData.availableTo
          ? new Date(formData.availableTo).toISOString()
          : null,
      };
      console.log("Update Data:", updateData);
      // Update the quiz
      const { error } = await supabase
        .from("quizzes")
        .update(updateData)
        .eq("id", quizId);

      if (error) throw error;

      toast.success("Quiz settings updated successfully!");
      router.push(`/quiz/${quizId}`);
    } catch (error) {
      console.error("Error updating quiz:", error);
      toast.error("Failed to update quiz settings");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      quizName: title,
      availableFrom: availableFrom
        ? new Date(availableFrom).toISOString().slice(0, 16)
        : "",
      availableTo: availableTo
        ? new Date(availableTo).toISOString().slice(0, 16)
        : "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Settings</CardTitle>
        <CardDescription>
          Modify the quiz name and availability dates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Name */}
          <div className="space-y-2">
            <Label htmlFor="quiz-name">Quiz Name</Label>
            <Input
              id="quiz-name"
              
              type="text"
              value={formData.quizName}
              onChange={handleChange}
              placeholder="Enter quiz name"
              disabled={true}
            />
          </div>

          {/* Available From */}
          <div className="space-y-2">
            <Label htmlFor="available-from">Available From</Label>
            <Input
              id="available-from"
              type="datetime-local"
              value={formData.availableFrom}
              onChange={handleChange}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              {availableFrom
                ? `Current: ${new Date(availableFrom).toLocaleString()}`
                : "No start date set"}
            </p>
          </div>

          {/* Available To */}
          <div className="space-y-2">
            <Label htmlFor="available-to">Available To</Label>
            <Input
              id="available-to"
              type="datetime-local"
              value={formData.availableTo}
              onChange={handleChange}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              {availableTo
                ? `Current: ${new Date(availableTo).toLocaleString()}`
                : "No end date set"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              {loading && <Spinner />}
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
