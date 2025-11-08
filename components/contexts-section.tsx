"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Archive, Search } from "lucide-react";
import type { Context, Task, Tag } from "@/lib/data";
import { ContextGroup } from "@/components/context-group";
import { ArchivedContexts } from "@/components/archived-contexts";
import { AddItemModal } from "@/components/add-item-modal";

interface ContextsSectionProps {
  contexts: Context[];
  tasks: Task[];
  tags: Tag[];
  collapsedState?: Record<string, boolean>;
  onCollapsedStateChange?: (collapsedState: Record<string, boolean>) => void;
  archivedContexts: Context[];
}

export function ContextsSection({
  contexts,
  tasks,
  tags,
  collapsedState = {},
  onCollapsedStateChange,
  archivedContexts,
}: ContextsSectionProps) {
  const [showArchivedContexts, setShowArchivedContexts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const handleExpandAll = () => {
    const next: Record<string, boolean> = {};
    for (const c of filteredContexts) next[c.id] = false;
    onCollapsedStateChange?.(next);
  };

  const handleCollapseAll = () => {
    const next: Record<string, boolean> = {};
    for (const c of filteredContexts) next[c.id] = true;
    onCollapsedStateChange?.(next);
  };

  // Filter contexts based on search query
  const filteredContexts = searchQuery.trim() === "" 
    ? contexts 
    : contexts.filter((context) => {
        // Check if context name matches
        if (context.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return true;
        }
        
        // Check if context description matches
        if (context.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
          return true;
        }
        
        // Check if any tasks in this context match the search
        const contextTasks = tasks.filter(task => task.contextId === context.id);
        return contextTasks.some(task => {
          const searchLower = searchQuery.toLowerCase();
          return (
            task.title.toLowerCase().includes(searchLower) ||
            task.project?.toLowerCase().includes(searchLower) ||
            task.notes?.toLowerCase().includes(searchLower) ||
            task.tags.some(tag => tag.toLowerCase().includes(searchLower))
          );
        });
      });

  const allCollapsed =
    filteredContexts.length > 0 && filteredContexts.every((c) => collapsedState[c.id] === true);
  const allExpanded =
    filteredContexts.length > 0 &&
    filteredContexts.every((c) => collapsedState[c.id] === false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-900">Contexts</h2>
          <AddItemModal
            contexts={contexts}
            tags={tags}
            addButtonSize="icon"
            defaultTab="context"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
            onClick={handleExpandAll}
            disabled={allExpanded}
          >
            <ChevronDown className="w-4 h-4 mr-1" /> Expand all
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
            onClick={handleCollapseAll}
            disabled={allCollapsed}
          >
            <ChevronUp className="w-4 h-4 mr-1" /> Collapse all
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search tasks, contexts, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
        />
      </div>

      {filteredContexts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredContexts.map((context) => {
            // Always use controlled mode, defaulting to false if not in state
            const collapsedValue = collapsedState[context.id] ?? false;

            return (
              <ContextGroup
                key={context.id}
                context={context}
                tasks={tasks}
                allContexts={contexts}
                tags={tags}
                collapsed={collapsedValue}
                onCollapsedChange={(value: boolean) =>
                  onCollapsedStateChange?.({
                    ...collapsedState,
                    [context.id]: value,
                  })
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {searchQuery.trim() === "" 
              ? "No contexts yet. Create one to get started!"
              : `No contexts or tasks match "${searchQuery}"`
            }
          </p>
        </div>
      )}

      {/* View Archived Contexts Button */}
      <div className="flex justify-center mt-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowArchivedContexts(true)}
          className="text-gray-600 hover:text-gray-900"
        >
          <Archive className="w-4 h-4 mr-2" />
          View Archived Contexts
        </Button>
      </div>

      {/* Archived Contexts Modal */}
      <ArchivedContexts
        archivedContexts={archivedContexts}
        isOpen={showArchivedContexts}
        onClose={() => setShowArchivedContexts(false)}
      />
    </div>
  );
}
