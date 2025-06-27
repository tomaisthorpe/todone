"use client";

import React, { useState, useEffect, useRef, useTransition, useCallback } from "react";
import * as chrono from "chrono-node";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createTaskAction } from "@/lib/server-actions";
import { Send, Calendar, Hash, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartTaskInputProps {
  contexts: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
  className?: string;
  onTaskCreated?: () => void;
}

interface ParsedTask {
  title: string;
  contextId: string | null;
  contextName: string | null;
  tags: string[];
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date | null;
  dueDateText: string | null;
}

interface ParsedSegment {
  text: string;
  type: "text" | "context" | "tag" | "priority" | "date";
  startIndex: number;
  endIndex: number;
}

export function SmartTaskInput({
  contexts,
  className,
  onTaskCreated,
}: SmartTaskInputProps) {
  const [input, setInput] = useState("");
  const [parsedTask, setParsedTask] = useState<ParsedTask>({
    title: "",
    contextId: null,
    contextName: null,
    tags: [],
    priority: "MEDIUM",
    dueDate: null,
    dueDateText: null,
  });
  const [segments, setSegments] = useState<ParsedSegment[]>([]);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse the input text
  const parseInput = useCallback((text: string): ParsedTask => {
    let workingText = text;
    const result: ParsedTask = {
      title: "",
      contextId: null,
      contextName: null,
      tags: [],
      priority: "MEDIUM",
      dueDate: null,
      dueDateText: null,
    };
    const newSegments: ParsedSegment[] = [];

    // Track original positions
    const currentOffset = 0;

    // Parse context (!contextName)
    const contextMatch = workingText.match(/!([a-zA-Z0-9_-]+)/i);
    if (contextMatch) {
      const contextName = contextMatch[1];
      const matchedContext = contexts.find(
        (ctx) => ctx.name.toLowerCase() === contextName.toLowerCase()
      );
      if (matchedContext) {
        result.contextId = matchedContext.id;
        result.contextName = matchedContext.name;
      } else {
        result.contextName = contextName;
      }

      // Add segment
      const startIndex = workingText.indexOf(contextMatch[0]);
      newSegments.push({
        text: contextMatch[0],
        type: "context",
        startIndex,
        endIndex: startIndex + contextMatch[0].length,
      });

      workingText = workingText.replace(contextMatch[0], " ");
    }

    // Parse tags (#tagname)
    const tagMatches = [...workingText.matchAll(/#([a-zA-Z0-9_-]+)/gi)];
    tagMatches.forEach((match) => {
      const tagName = match[1];
      result.tags.push(tagName);

      // Add segment
      const startIndex = text.indexOf(match[0], currentOffset);
      newSegments.push({
        text: match[0],
        type: "tag",
        startIndex,
        endIndex: startIndex + match[0].length,
      });

      workingText = workingText.replace(match[0], " ");
    });

    // Parse priority (p1, p2, p3)
    const priorityMatch = workingText.match(/\bp([123])\b/i);
    if (priorityMatch) {
      const priorityNum = priorityMatch[1];
      result.priority =
        priorityNum === "1" ? "HIGH" : priorityNum === "2" ? "MEDIUM" : "LOW";

      // Add segment
      const startIndex = text.indexOf(priorityMatch[0]);
      newSegments.push({
        text: priorityMatch[0],
        type: "priority",
        startIndex,
        endIndex: startIndex + priorityMatch[0].length,
      });

      workingText = workingText.replace(priorityMatch[0], " ");
    }

    // Parse date using chrono
    const chronoResults = chrono.parse(workingText);
    if (chronoResults.length > 0) {
      const chronoResult = chronoResults[0];
      result.dueDate = chronoResult.start.date();
      result.dueDateText = chronoResult.text;

      // Add segment
      const startIndex = text.indexOf(chronoResult.text);
      if (startIndex !== -1) {
        newSegments.push({
          text: chronoResult.text,
          type: "date",
          startIndex,
          endIndex: startIndex + chronoResult.text.length,
        });
      }

      workingText = workingText.replace(chronoResult.text, " ");
    }

    // The remaining text is the title
    result.title = workingText.replace(/\s+/g, " ").trim();

    // Create text segments
    let lastIndex = 0;
    newSegments.sort((a, b) => a.startIndex - b.startIndex);

    const finalSegments: ParsedSegment[] = [];
    newSegments.forEach((segment) => {
      // Add text before this segment
      if (segment.startIndex > lastIndex) {
        const textBefore = text.slice(lastIndex, segment.startIndex);
        if (textBefore.trim()) {
          finalSegments.push({
            text: textBefore,
            type: "text",
            startIndex: lastIndex,
            endIndex: segment.startIndex,
          });
        }
      }
      finalSegments.push(segment);
      lastIndex = segment.endIndex;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      const textAfter = text.slice(lastIndex);
      if (textAfter.trim()) {
        finalSegments.push({
          text: textAfter,
          type: "text",
          startIndex: lastIndex,
          endIndex: text.length,
        });
      }
    }

    setSegments(finalSegments);
    return result;
  }, [contexts]);

  // Update parsing when input changes
  useEffect(() => {
    const parsed = parseInput(input);
    setParsedTask(parsed);
  }, [input, contexts, parseInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsedTask.title.trim()) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", parsedTask.title);
      formData.append("priority", parsedTask.priority);
      
      // Use the first context if no specific context is found
      const contextId = parsedTask.contextId || contexts[0]?.id;
      if (contextId) {
        formData.append("contextId", contextId);
      }
      
      if (parsedTask.dueDate) {
        formData.append("dueDate", parsedTask.dueDate.toISOString().slice(0, 16));
      }
      formData.append("type", "TASK");
      formData.append("tags", parsedTask.tags.join(", "));

      try {
        await createTaskAction(formData);
        setInput("");
        onTaskCreated?.();
      } catch (error) {
        console.error("Failed to create task:", error);
      }
    });
  };

  const renderHighlightedText = () => {
    if (segments.length === 0) return input;

    return segments.map((segment, index) => {
      const colorClass = {
        text: "text-gray-900",
        context: "text-blue-600 bg-blue-50 px-1 rounded font-medium",
        tag: "text-green-600 bg-green-50 px-1 rounded font-medium",
        priority: "text-purple-600 bg-purple-50 px-1 rounded font-medium",
        date: "text-orange-600 bg-orange-50 px-1 rounded font-medium",
      }[segment.type];

      return (
        <span key={index} className={colorClass}>
          {segment.text}
        </span>
      );
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "text-red-600 bg-red-50 border-red-200";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "LOW":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 0) return `${Math.abs(diffDays)}d ago`;
    if (diffDays < 7) return `In ${diffDays}d`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Input */}
        <div className="relative">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your task naturally... e.g., 'Setup Todone !Homelab #sideprojects #setup p1 tomorrow'"
            className="text-base py-3 pr-12 font-mono"
            disabled={isPending}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!parsedTask.title.trim() || isPending}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Highlighted Text Preview */}
        {input && (
          <div className="text-sm bg-gray-50 p-3 rounded-lg border">
            <div className="font-medium text-gray-700 mb-2">Parsing:</div>
            <div className="font-mono leading-relaxed">
              {renderHighlightedText()}
            </div>
          </div>
        )}

        {/* Parsed Task Preview */}
        {(parsedTask.title ||
          parsedTask.contextName ||
          parsedTask.tags.length > 0 ||
          parsedTask.priority !== "MEDIUM" ||
          parsedTask.dueDate) && (
          <div className="bg-white border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Zap className="w-4 h-4" />
              Task Preview
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <Label className="text-xs text-gray-500">Title</Label>
                <div className="text-sm font-medium">
                  {parsedTask.title || <span className="text-gray-400">No title</span>}
                </div>
              </div>

              {/* Context */}
              <div>
                <Label className="text-xs text-gray-500">Context</Label>
                <div className="text-sm">
                  {parsedTask.contextName ? (
                    <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">
                      {parsedTask.contextName}
                    </Badge>
                  ) : (
                    <span className="text-gray-400">
                      {contexts[0]?.name || "No context"}
                    </span>
                  )}
                </div>
              </div>

              {/* Priority */}
              <div>
                <Label className="text-xs text-gray-500">Priority</Label>
                <div className="text-sm">
                  <Badge className={getPriorityColor(parsedTask.priority)}>
                    {parsedTask.priority}
                  </Badge>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <Label className="text-xs text-gray-500">Due Date</Label>
                <div className="text-sm">
                  {parsedTask.dueDate ? (
                    <Badge variant="outline" className="text-orange-600 bg-orange-50 border-orange-200">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(parsedTask.dueDate)}
                    </Badge>
                  ) : (
                    <span className="text-gray-400">No due date</span>
                  )}
                </div>
              </div>

              {/* Tags */}
              {parsedTask.tags.length > 0 && (
                <div className="md:col-span-2">
                  <Label className="text-xs text-gray-500">Tags</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {parsedTask.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-green-600 bg-green-50 border-green-200"
                      >
                        <Hash className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </form>

      {/* Help Text */}
      <div className="text-xs text-gray-500 mt-2">
        <div className="font-medium mb-1">Quick syntax:</div>
        <div className="space-y-1">
          <div><code className="bg-blue-50 text-blue-600 px-1 rounded">!context</code> for context</div>
          <div><code className="bg-green-50 text-green-600 px-1 rounded">#tag</code> for tags</div>
          <div><code className="bg-purple-50 text-purple-600 px-1 rounded">p1/p2/p3</code> for priority (high/medium/low)</div>
          <div><code className="bg-orange-50 text-orange-600 px-1 rounded">tomorrow, next week, in 3 days</code> for due dates</div>
        </div>
      </div>
    </div>
  );
}