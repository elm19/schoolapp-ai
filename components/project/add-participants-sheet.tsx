"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Search, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Participant {
  id: string;
  username: string;
  email: string;
}

interface AddParticipantsSheetProps {
  projectId: string;
}

export const AddParticipantsSheet = ({
  projectId,
}: AddParticipantsSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<
    Participant[]
  >([]);
  const [searchResults, setSearchResults] = useState<Participant[]>([]);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, username")
        .ilike("username", `%${searchQuery}%`);
      console.log("Search Results:", data, error);

      if (error) {
        setSearchResults([]);
      } else {
        setSearchResults(data || []);
      }

      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, supabase]);

  const handleSelectParticipant = (participant: Participant) => {
    console.log("Toggling participant:", participant);
    console.log("Currently selected participants:", selectedParticipants);
    setSelectedParticipants((prev) => {
      // Check if already selected
      const isSelected = prev.some((p) => p.id === participant.id);

      if (isSelected) {
        // Remove if already selected
        return prev.filter((p) => p.id !== participant.id);
      } else {
        // Add if not selected
        return [...prev, participant];
      }
    });
  };

  const handleRemoveSelected = async (participantId: string) => {
    setSelectedParticipants((prev) =>
      prev.filter((p) => p.id !== participantId)
    );
  };

  const handleSubmit = async () => {
    if (selectedParticipants.length === 0) return;

    console.log(
      "Adding participants to project",
      projectId,
      ":",
      selectedParticipants
    );
    const { data, error } = await supabase.from("project_participants").insert(
      selectedParticipants.map((participant) => ({
        project_id: projectId,
        student_id: participant.id,
      }))
    );
    console.log("Insert Result:", data, error);
    // Reset and close
    setSearchQuery("");
    setSelectedParticipants([]);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset when closing
      setSearchQuery("");
      setSelectedParticipants([]);
    }
    setIsOpen(open);
  };

  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if a participant is selected
  const isParticipantSelected = (participantId: string) => {
    return selectedParticipants.some((p) => p.id === participantId);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>Add Participants</Button>
      </SheetTrigger>

      <SheetContent className="w-full px-5 sm:w-[540px] flex flex-col overflow-hidden">
        <SheetHeader>
          <SheetTitle>Add Participants to Project</SheetTitle>
          <SheetDescription>
            Search and select students to add to this project.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col gap-4 mt-6 min-h-0">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by email or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Selected Participants Chips */}
          {selectedParticipants.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Selected ({selectedParticipants.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedParticipants.map((participant) => (
                  <Badge
                    key={participant.id}
                    variant="secondary"
                    className="gap-2 pr-1"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">
                        {getInitials(participant.username)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{participant.username}</span>
                    <button
                      onClick={() => handleRemoveSelected(participant.id)}
                      className="ml-1 rounded-full hover:bg-white/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="flex-1 border rounded-lg overflow-hidden flex flex-col min-h-0">
            {searchQuery.trim() === "" ? (
              <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
                <div>
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    Start typing to search for participants
                  </p>
                </div>
              </div>
            ) : isSearching ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : searchResults.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
                <div>
                  <p className="text-sm">
                    No results found for &quot;{searchQuery}&quot;
                  </p>
                </div>
              </div>
            ) : (
              <ScrollArea className="flex-1 py-5">
                <div className="space-y-2 p-4">
                  {searchResults.map((participant) => {
                    const isSelected = isParticipantSelected(participant.id);
                    return (
                      <button
                        key={participant.id}
                        onClick={() => handleSelectParticipant(participant)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          isSelected
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-muted border-muted"
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0"
                        />
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="text-xs">
                            {getInitials(participant.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-medium truncate">
                            {participant.username}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {participant.email}
                          </p>
                        </div>
                        {isSelected && <div className="text-primary">✓</div>}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 py-4 justify-end border-t">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button
              onClick={handleSubmit}
              disabled={selectedParticipants.length === 0}
            >
              Add{" "}
              {selectedParticipants.length > 0 &&
                `(${selectedParticipants.length})`}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
