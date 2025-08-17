import React from "react";
import { cn } from "@/lib/utils";

interface MarkdownTextProps {
  text: string;
  className?: string;
}

export function MarkdownText({ text, className }: MarkdownTextProps) {
  // Simple inline markdown parser for basic formatting
  const parseInlineMarkdown = (input: string): React.ReactElement[] => {
    const parts: React.ReactElement[] = [];
    let currentIndex = 0;
    let partIndex = 0;

    // Regex patterns for different markdown elements
    const patterns = [
      { regex: /`([^`]+)`/g, type: "code" }, // `code`
      { regex: /\*\*([^*]+)\*\*/g, type: "bold" }, // **bold**
      { regex: /_([^_]+)_/g, type: "italic" }, // _italic_
    ];

    // Find all matches and their positions
    const matches: Array<{
      start: number;
      end: number;
      content: string;
      type: string;
      match: string;
    }> = [];

    patterns.forEach(({ regex, type }) => {
      let match;
      const tempRegex = new RegExp(regex.source, regex.flags);
      while ((match = tempRegex.exec(input)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          content: match[1],
          type,
          match: match[0],
        });
      }
    });

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);

    // Remove overlapping matches (keep the first one)
    const validMatches: typeof matches = [];
    for (const match of matches) {
      if (
        !validMatches.some(
          (vm) =>
            (match.start >= vm.start && match.start < vm.end) ||
            (match.end > vm.start && match.end <= vm.end) ||
            (match.start <= vm.start && match.end >= vm.end)
        )
      ) {
        validMatches.push(match);
      }
    }

    // Build the result
    validMatches.forEach((match) => {
      // Add text before the match
      if (match.start > currentIndex) {
        const textBefore = input.substring(currentIndex, match.start);
        if (textBefore) {
          parts.push(<span key={`text-${partIndex++}`}>{textBefore}</span>);
        }
      }

      // Add the formatted match
      switch (match.type) {
        case "code":
          parts.push(
            <code
              key={`code-${partIndex++}`}
              className="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded-sm font-mono text-[11px] border border-gray-300 inline align-middle"
            >
              {match.content}
            </code>
          );
          break;
        case "bold":
          parts.push(
            <strong key={`bold-${partIndex++}`} className="font-semibold">
              {match.content}
            </strong>
          );
          break;
        case "italic":
          parts.push(
            <em key={`italic-${partIndex++}`} className="italic">
              {match.content}
            </em>
          );
          break;
      }

      currentIndex = match.end;
    });

    // Add remaining text
    if (currentIndex < input.length) {
      const remainingText = input.substring(currentIndex);
      if (remainingText) {
        parts.push(<span key={`text-${partIndex++}`}>{remainingText}</span>);
      }
    }

    // If no matches found, return the original text
    if (parts.length === 0) {
      parts.push(<span key="original">{input}</span>);
    }

    return parts;
  };

  const parsedContent = parseInlineMarkdown(text);

  return (
    <span className={cn("markdown-text", className)}>{parsedContent}</span>
  );
}
