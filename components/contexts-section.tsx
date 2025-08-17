"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Archive } from "lucide-react";
import type { Context, Task, Tag } from "@/lib/data";
import { ContextGroup } from "@/components/context-group";
import { ArchivedContexts } from "@/components/archived-contexts";

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
  const handleExpandAll = () => {
    const next: Record<string, boolean> = {};
    for (const c of contexts) next[c.id] = false;
    onCollapsedStateChange?.(next);
  };

  const handleCollapseAll = () => {
    const next: Record<string, boolean> = {};
    for (const c of contexts) next[c.id] = true;
    onCollapsedStateChange?.(next);
  };

  const allCollapsed =
    contexts.length > 0 && contexts.every((c) => collapsedState[c.id] === true);
  const allExpanded =
    contexts.length > 0 &&
    contexts.every((c) => collapsedState[c.id] === false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Contexts</h2>
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

      {contexts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {contexts.map((context) => {
            const isControlled = Object.prototype.hasOwnProperty.call(
              collapsedState,
              context.id
            );
            const collapsedValue = collapsedState[context.id];

            return (
              <ContextGroup
                key={context.id}
                context={context}
                tasks={tasks}
                allContexts={contexts}
                tags={tags}
                {...(isControlled
                  ? {
                      collapsed: collapsedValue,
                      onCollapsedChange: (value: boolean) =>
                        onCollapsedStateChange?.({
                          ...collapsedState,
                          [context.id]: value,
                        }),
                    }
                  : {})}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No contexts yet. Create one to get started!
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
