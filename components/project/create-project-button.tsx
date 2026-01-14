"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const projectFormSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .min(3, "Name must be at least 3 characters"),
  overview: z
    .string()
    .min(1, "Overview is required")
    .min(10, "Overview must be at least 10 characters"),
  status: z.enum(["ongoing", "finished"]),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const CreateProjectButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      overview: "",
      status: "ongoing",
    },
  });

  const onSubmit = (data: ProjectFormValues) => {
    console.log("New Project Created:", {
      ...data,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
    });

    form.reset();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <span className="mr-2">+</span>
          Create New Project
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full  pt-10 px-10  overflow-y-auto">
        {/* <SheetHeader> */}
          <SheetTitle>Create New Project</SheetTitle>
          <SheetDescription>
            Add a new project by filling in the details below. Click save when
            done.
          </SheetDescription>
        {/* </SheetHeader> */}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-6"
          >
            {/* Project Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the project as students will see it.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project Overview */}
            <FormField
              control={form.control}
              name="overview"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Overview</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what students will learn and accomplish in this project..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of the project objectives and scope.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="finished">Finished</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Indicate whether this project is currently active or
                    completed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-6 border-t">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit">Save Project</Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
