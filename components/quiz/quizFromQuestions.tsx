"use client";

import React from "react";
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
import { createClient } from "@/lib/supabase/client";

export type QuizQuestion = {
  id: string | number;
  question: string;  options: string[];
};

type QuizFormProps = {
  questions: QuizQuestion[];
  userId: string;
  quizId: string;
};

// Create dynamic Zod schema based on questions
const createQuizSchema = (questions: QuizQuestion[]) => {
  const schemaFields: Record<string, z.ZodString> = {};

  questions.forEach((q) => {
    schemaFields[`question_${q.id}`] = z.string({
      message: "Please select an answer",
    });
  });

  return z.object(schemaFields);
};

export default function QuizForm({ questions, userId, quizId }: QuizFormProps) {
  const formSchema = createQuizSchema(questions);
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    console.log("Quiz Answers:", data);
    const supabase = createClient();
    const { error } = await supabase.from("quizzes_sub").insert([
      {
        sub: data,
        user_id: userId,
        quiz_id: quizId,
      },
    ]);
    if (error) {
      console.error("Error submitting quiz:", error);
    } else {
      console.log("Quiz submitted successfully");
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
            name={`question_${question.id}` as string}
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
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit">Submit Quiz</Button>
        </Field>
      </form>
    </Form>
  );
}