import React from "react";

interface HighlightedTextProps {
  text: string;
  searchQuery?: string;
  className?: string;
}

/**
 * Component that highlights matching text based on a search query
 */
export function HighlightedText({
  text,
  searchQuery,
  className = "",
}: HighlightedTextProps) {
  // If no search query, return the text as-is
  if (!searchQuery || searchQuery.trim() === "") {
    return <span className={className}>{text}</span>;
  }

  const query = searchQuery.trim();
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        // Check if this part matches the search query (case-insensitive)
        if (part.toLowerCase() === query.toLowerCase()) {
          return (
            <mark
              key={index}
              className="bg-yellow-200 text-gray-900 px-0.5 rounded"
            >
              {part}
            </mark>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}
