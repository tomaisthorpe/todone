"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function TagsInput({
  value = [],
  onChange,
  suggestions = [],
  placeholder = "Add tags...",
  className,
  disabled = false,
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input value
  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(suggestion) &&
      inputValue.trim() !== ""
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(newValue.trim().length > 0);
    setSelectedSuggestionIndex(-1);
  };

  // Handle key press
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case ",":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && filteredSuggestions.length > 0) {
          addTag(filteredSuggestions[selectedSuggestionIndex]);
        } else if (inputValue.trim()) {
          addTag(inputValue.trim());
        }
        break;
      case "Backspace":
        if (!inputValue && value.length > 0) {
          removeTag(value.length - 1);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Add a tag
  const addTag = (tag: string) => {
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInputValue("");
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Remove a tag
  const removeTag = (index: number) => {
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
    inputRef.current?.focus();
  };

  // Handle input blur
  const handleBlur = () => {
    // Delay hiding suggestions to allow for suggestion clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }, 150);
  };

  // Handle input focus
  const handleFocus = () => {
    if (inputValue.trim().length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex flex-wrap gap-1 p-2 border border-input bg-background rounded-md min-h-10",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                className="ml-1 hover:text-destructive focus:outline-none"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-20 border-0 shadow-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={disabled}
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-48 overflow-y-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              className={cn(
                "w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                index === selectedSuggestionIndex && "bg-accent text-accent-foreground"
              )}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}