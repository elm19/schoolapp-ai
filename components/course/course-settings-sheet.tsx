"use client";

import { useState } from "react";
import { Settings, Eye, Trash2, UserPlus, UserX } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";

type Participant = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: "pending" | "accepted" | "rejected";
};

type PDFFile = {
  id: string;
  name: string;
  url: string;
  size: number;
};

type CourseSettingsSheetProps = {
  courseId: number;
  courseName?: string;
  courseDescription?: string;
  courseStatus?: "ongoing" | "archived";
  participants?: Participant[];
  allowPublicEnroll?: boolean;
  supportFiles?: PDFFile[];
  onDeleteCourse?: () => void;
};

// Dummy participants data
const DUMMY_PARTICIPANTS: Participant[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    status: "accepted",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    status: "accepted",
  },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol.williams@example.com",
    status: "pending",
  },
  {
    id: "4",
    name: "David Brown",
    email: "david.brown@example.com",
    status: "accepted",
  },
];

// Dummy PDF files
const DUMMY_FILES: PDFFile[] = [
  {
    id: "1",
    name: "Chapter 1 - Introduction to Basics.pdf",
    url: "#",
    size: 2048576,
  },
  {
    id: "2",
    name: "Chapter 2 - Advanced Concepts.pdf",
    url: "#",
    size: 3145728,
  },
  {
    id: "3",
    name: "Quiz Questions and Answers.pdf",
    url: "#",
    size: 1572864,
  },
  {
    id: "4",
    name: "Reference Materials.pdf",
    url: "#",
    size: 5242880,
  },
];

export const CourseSettingsSheet = ({
  courseId,
  courseName,
  courseDescription,
  courseStatus = "ongoing",
  participants = DUMMY_PARTICIPANTS,
  allowPublicEnroll = false,
  supportFiles = DUMMY_FILES,
  onDeleteCourse,
}: CourseSettingsSheetProps) => {
  const [open, setOpen] = useState(false);
  const onSave = async (data: {
    title: string;
    description: string;
    status: "ongoing" | "archived";
    isPublic: boolean;
  }) => {
    // connect to supabase
    const supabase = createClient();
    console.log("SAVING COURSE SETTINGS ", data);
    await supabase.from("courses").update({
      title: data.title,
      overview: data.description,
    }).eq("id", courseId);
  };
  // General Settings State
  const [title, setTitle] = useState(courseName);
  const [description, setDescription] = useState(courseDescription);
  const [status, setStatus] = useState<"ongoing" | "archived">(courseStatus);

  // Participants Settings State
  const [isPublic, setIsPublic] = useState(allowPublicEnroll);
  const [participantsList, setParticipantsList] = useState(participants);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [showParticipantDialog, setShowParticipantDialog] = useState(false);

  const handleSaveSettings = () => {
    onSave?.({
      title,
      description,
      status,
      isPublic,
    });
    setOpen(false);
  };

  const handleAcceptParticipant = (participantId: string) => {
    setParticipantsList(
      participantsList.map((p) =>
        p.id === participantId ? { ...p, status: "accepted" } : p
      )
    );
  };

  const handleRejectParticipant = (participantId: string) => {
    setParticipantsList(
      participantsList.map((p) =>
        p.id === participantId ? { ...p, status: "rejected" } : p
      )
    );
  };

  const handleDeleteFile = (fileId: string) => {
    // This would be handled by backend
    console.log("Delete file:", fileId);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const acceptedParticipants = participantsList.filter(
    (p) => p.status === "accepted"
  );
  const pendingParticipants = participantsList.filter(
    (p) => p.status === "pending"
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[100vw] md:w-[900px]  p-7 overflow-y-auto bg-background"
      >
        <SheetHeader className="pb-6 border-b">
          <SheetTitle className="text-2xl">Course Settings</SheetTitle>
          <SheetDescription>
            Manage course settings, participants, and resources
          </SheetDescription>
          <SheetClose />
        </SheetHeader>

        <div className="space-y-8 py-8">
          {/* ===== SECTION 1: GENERAL COURSE INFO ===== */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-lg">📋 General Information</h3>
              <p className="text-xs text-muted-foreground">
                Edit basic course details and settings
              </p>
            </div>
            <Separator className="mt-3" />

            <div className="space-y-4 bg-muted/30 p-5 rounded-lg border">
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Course Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter course title"
                  className="bg-background"
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Course Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter course description"
                  rows={4}
                  className="bg-background resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Course Status
                </label>
                <Select
                  value={status}
                  onValueChange={(value: any) => setStatus(value)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ongoing">
                      <span className="flex items-center gap-2">
                        🟢 Ongoing
                      </span>
                    </SelectItem>
                    <SelectItem value="archived">
                      <span className="flex items-center gap-2">
                        📦 Archived
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* ===== SECTION 2: PARTICIPANTS SETTINGS ===== */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-lg">👥 Participants</h3>
              <p className="text-xs text-muted-foreground">
                Manage course enrollment and student permissions
              </p>
            </div>
            <Separator className="mt-3" />

            <div className="space-y-4">
              {/* Enrollment Settings Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-950 dark:to-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="public-enroll"
                    checked={isPublic}
                    onCheckedChange={(checked) =>
                      setIsPublic(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="public-enroll"
                    className="text-sm font-semibold cursor-pointer flex-1"
                  >
                    Allow anyone to enroll
                  </label>
                </div>
                <p className="text-xs text-muted-foreground pl-7 mt-2">
                  {isPublic
                    ? "✓ Students can enroll without approval"
                    : "⚠ Enrollment requires your manual acceptance"}
                </p>
              </div>

              {/* Participants Count Cards */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-50 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Accepted
                  </p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {acceptedParticipants.length}
                  </p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-50 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Pending
                  </p>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                    {pendingParticipants.length}
                  </p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-50 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Total
                  </p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                    {participantsList.length}
                  </p>
                </Card>
              </div>

              {/* Participants List */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Student List</h4>
                <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                  {participantsList.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
                      <p className="text-sm">No participants yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {participantsList.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Avatar className="w-9 h-9 flex-shrink-0">
                              <AvatarFallback className="text-xs font-semibold">
                                {participant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {participant.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {participant.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            {/* View More Info Dialog */}
                            <Dialog
                              open={
                                showParticipantDialog &&
                                selectedParticipant?.id === participant.id
                              }
                              onOpenChange={(isOpen) => {
                                setShowParticipantDialog(isOpen);
                                if (isOpen) setSelectedParticipant(participant);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() =>
                                    setSelectedParticipant(participant)
                                  }
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Participant Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                  <div className="flex justify-center">
                                    <Avatar className="w-16 h-16">
                                      <AvatarFallback className="text-lg font-semibold">
                                        {participant.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                  <div className="text-center">
                                    <p className="font-semibold">
                                      {participant.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {participant.email}
                                    </p>
                                  </div>
                                  <div className="bg-muted p-3 rounded-lg">
                                    <p className="text-xs font-medium mb-1">
                                      Status
                                    </p>
                                    <p className="text-sm capitalize font-semibold">
                                      {participant.status === "accepted" && (
                                        <span className="text-emerald-600">
                                          ✓ {participant.status}
                                        </span>
                                      )}
                                      {participant.status === "pending" && (
                                        <span className="text-yellow-600">
                                          ⏳ {participant.status}
                                        </span>
                                      )}
                                      {participant.status === "rejected" && (
                                        <span className="text-red-600">
                                          ✗ {participant.status}
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            {/* Accept Button */}
                            {participant.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                                onClick={() =>
                                  handleAcceptParticipant(participant.id)
                                }
                                title="Accept participant"
                              >
                                <UserPlus className="w-4 h-4" />
                              </Button>
                            )}

                            {/* Reject Button */}
                            {participant.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                                onClick={() =>
                                  handleRejectParticipant(participant.id)
                                }
                                title="Reject participant"
                              >
                                <UserX className="w-4 h-4" />
                              </Button>
                            )}

                            {/* Status Badge */}
                            {participant.status !== "pending" && (
                              <div
                                className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                                  participant.status === "accepted"
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400"
                                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400"
                                }`}
                              >
                                {participant.status === "accepted" && "✓"}
                                {participant.status === "rejected" && "✗"}{" "}
                                {participant.status}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ===== SECTION 3: COURSE SUPPORT FILES ===== */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-lg">📄 Course Support Files</h3>
              <p className="text-xs text-muted-foreground">
                Manage PDF materials and learning resources
              </p>
            </div>
            <Separator className="mt-3" />

            {supportFiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
                <p className="text-sm">No PDF files uploaded</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                  {supportFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-red-600 dark:text-red-400">
                            📄
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="View file"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                          onClick={() => handleDeleteFile(file.id)}
                          title="Delete file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ===== SECTION 4: DANGER ZONE - DELETE COURSE ===== */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-red-600">⚠️ Danger Zone</h3>
              <p className="text-xs text-red-600/70">
                Irreversible actions - proceed with caution
              </p>
            </div>
            <Separator className="mt-3" />

            <Card className="p-5 border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800">
              <p className="text-sm font-bold text-red-900 dark:text-red-100 mb-2">
                Delete This Course
              </p>
              <p className="text-xs text-red-800 dark:text-red-200 mb-4 leading-relaxed">
                This action is permanent and cannot be undone. All course data,
                student enrollments, and associated materials will be deleted
                from the system.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full font-semibold"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Course
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-red-600">
                      Delete Course?
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">
                        ⚠️ This action cannot be undone
                      </p>
                      <p className="text-sm text-red-800 dark:text-red-200">
                        Are you sure you want to permanently delete this course?
                        All students will be unenrolled and all data will be
                        lost.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          Cancel
                        </Button>
                      </DialogTrigger>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => {
                          onDeleteCourse?.();
                          setOpen(false);
                        }}
                      >
                        Delete Course
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
          </div>

          {/* Save Button - Sticky Footer */}
          <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-2 border-t mt-6 flex gap-2">
            <Button
              variant="outline"
              className="flex-1 font-semibold"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSettings}
              className="flex-1 font-semibold"
            >
              ✓ Save Changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
