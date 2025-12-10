"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field } from "../ui/field";
import { useRouter } from "next/navigation";

export type QuizQuestion = {
  id: string | number;
  question: string;
  options: string[];
};

type QuizFormProps = {
  questions: QuizQuestion[];
  quizId: string;
};

const createQuizSchema = (questions: QuizQuestion[]) => {
  const schemaFields: Record<string, z.ZodString> = {};
  questions.forEach((q) => {
    schemaFields[`${q.id}`] = z.string({
      message: "Please select an answer",
    });
  });
  return z.object(schemaFields);
};

export default function QuizForm({ questions, quizId }: QuizFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const formSchema = createQuizSchema(questions);
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submit-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quizId, data }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit quiz");
      }
      router.push(`/quiz/${quizId}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("There was an error submitting the quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
      
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl p-6"
      >
        {questions.map((question, index) => (
          <FormField
            key={question.id}
            control={form.control}
            name={`${question.id}` as string}
            render={({ field }) => (
              <FormItem className="space-y-3 p-4 border rounded-lg">
                <FormLabel className="text-base font-semibold">
                  {index + 1}. {question.question}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-2"
                  >
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={optionIndex.toString()}
                          id={`${question.id}_${optionIndex}`}
                        />
                        <label
                          htmlFor={`${question.id}_${optionIndex}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Reset
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        </Field>
      </form>
    </Form>
  );
}
