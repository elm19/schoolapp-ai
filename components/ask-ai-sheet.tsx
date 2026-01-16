"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AskAISheetProps {
  pageContent?: Record<string, string>;
  trigger?: React.ReactNode;
}

export function AskAISheet({
  pageContent = {},
  trigger = (
    <Button variant="ghost" size="icon" title="Ask AI">
      <Sparkles className="w-5 h-5" />
    </Button>
  ),
}: AskAISheetProps) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [scope, setScope] = useState<"general" | "page">("general");
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const pageSections = Object.keys(pageContent);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      let prompt = question;
      const parsingRules =
        "\n\n[RESPONSE FORMAT RULES]\n" +
        "\n\n dont add any unnecessary intro text\n" +
        "- Use bullet points (- or *) for lists\n" +
        "- Use numbered lists (1., 2., etc.) when order matters\n" +
        "- Use bold (**text**) for emphasis\n" +
        "- Use code blocks (```language\ncode\n```) for code snippets\n" +
        "- Separate major sections with a blank line\n" +
        "- Keep response concise and well-structured";

      if (scope === "page" && selectedSections.size > 0) {
        const contextParts = Array.from(selectedSections)
          .map((section) => `${section}:\n${pageContent[section]}`)
          .join("\n\n---\n\n");

        prompt = `Based on this page content:\n\n${contextParts}\n\nAnswer this question: ${question}${parsingRules}`;
      } else {
        prompt = `${question}${parsingRules}`;
      }

      const res = await fetch("/api/gemini-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          source: false,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const data = await res.json();
      console.log("AI Response Data:", data);
      setResponse(data.output || "No response received");
    } catch (error) {
      setResponse(
        `Error: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuestion("");
    setResponse(null);
    setScope("general");
    setSelectedSections(new Set());
  };

  const toggleSection = (section: string) => {
    const newSelected = new Set(selectedSections);
    if (newSelected.has(section)) {
      newSelected.delete(section);
    } else {
      newSelected.add(section);
    }
    setSelectedSections(newSelected);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full px-2 sm:max-w-md max-h-screen overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Ask AI
          </SheetTitle>
          <SheetDescription>
            Ask me anything about your content or get general help
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {!response ? (
            <>
              {/* Scope Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Scope</Label>
                <RadioGroup
                  value={scope}
                  onValueChange={(value) => {
                    setScope(value as "general" | "page");
                    setSelectedSections(new Set());
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="general" />
                    <Label
                      htmlFor="general"
                      className="font-normal cursor-pointer"
                    >
                      General
                    </Label>
                  </div>
                  {pageSections.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="page" id="page" />
                      <Label
                        htmlFor="page"
                        className="font-normal cursor-pointer"
                      >
                        With Page Content
                      </Label>
                    </div>
                  )}
                </RadioGroup>
              </div>

              {/* Page Content Sections Selection */}
              {scope === "page" && pageSections.length > 0 && (
                <div className="space-y-3 pl-4 border-l-2 border-muted-foreground">
                  <Label className="text-sm font-semibold">
                    Select sections to include as context:
                  </Label>
                  <div className="space-y-2">
                    {pageSections.map((section) => (
                      <div
                        key={section}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`section-${section}`}
                          checked={selectedSections.has(section)}
                          onCheckedChange={() => toggleSection(section)}
                        />
                        <Label
                          htmlFor={`section-${section}`}
                          className="font-normal cursor-pointer capitalize"
                        >
                          {section.replace(/_/g, " ")}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Question Input */}
              <div className="space-y-2">
                <Label htmlFor="question" className="text-base font-semibold">
                  Your Question
                </Label>
                <Textarea
                  id="question"
                  placeholder="Ask me anything..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[120px] resize-none"
                  disabled={loading}
                />
              </div>

              {/* Send Button */}
              <Button
                onClick={handleAsk}
                disabled={
                  !question.trim() ||
                  loading ||
                  (scope === "page" && selectedSections.size === 0)
                }
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Ask AI
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Response Display */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Response</Label>
                <Card className="p-4 bg-muted">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {response}
                  </p>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="flex-1"
                >
                  Ask Another
                </Button>
                <Button onClick={() => setOpen(false)} className="flex-1">
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
