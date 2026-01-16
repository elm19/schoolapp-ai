"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";

interface GenerateQuizProps {
    prompt: string;
    courseId: number;
}

const GenerateQuiz = ({ prompt, courseId }: GenerateQuizProps) => {
    const router = useRouter();
  const [open, setOpen] = useState(false);
  const [quizName, setQuizName] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quizName.trim() || !numQuestions || !difficulty) {
      alert("Please fill in all fields");
      return;
    }

    const questionsNum = parseInt(numQuestions, 10);
    if (questionsNum < 1 || questionsNum > 50) {
      alert("Number of questions must be between 1 and 50");
      return;
    }
    const quizInfo = {
      quizName: quizName.trim(),
      numQuestions: questionsNum,
      difficulty,
    };

    // call the api to generate the quiz
    setLoading(true);
    try {
      const res = await fetch("/api/gemini-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          course_id: courseId,
          quizInfo,
          source: true,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

        await res.json();
        router.refresh();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
      
    // Reset form
    setQuizName("");
    setNumQuestions("");
    setDifficulty("");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2 w-full sm:w-auto">
          Generate Quiz
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full p-2 sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Generate Quiz</SheetTitle>
          <SheetDescription>
            Fill in the details to generate a new quiz for your course.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Quiz Name */}
          <div className="space-y-2">
            <Label htmlFor="quiz-name">Quiz Name</Label>
            <Input
              id="quiz-name"
              placeholder="Enter quiz name"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Number of Questions */}
          <div className="space-y-2">
            <Label htmlFor="num-questions">
              Number of Questions{" "}
              <span className="text-xs text-slate-500">(Max 50)</span>
            </Label>
            <Input
              id="num-questions"
              type="number"
              min="1"
              max="50"
              placeholder="Enter number of questions"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              disabled={loading}
            />
            {numQuestions && (
              <p className="text-xs text-slate-500">
                {numQuestions} / 50 questions
              </p>
            )}
          </div>

          {/* Difficulty Level */}
          <div className="space-y-2">
            <Label htmlFor="difficulty">Level of Difficulty</Label>
            <Select
              value={difficulty}
              onValueChange={setDifficulty}
              disabled={loading}
            >
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading && <Spinner />}
            {loading ? "Generating..." : "Generate Quiz"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default GenerateQuiz;
