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

export function ContextsSection({ contexts, tasks, tags, collapsedState = {}, onCollapsedStateChange, archivedContexts }: ContextsSectionProps) {
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
    contexts.length > 0 && contexts.every((c) => collapsedState[c.id] === false);

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
          {archivedContexts.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setShowArchivedContexts(!showArchivedContexts)}
            >
              <Archive className="w-4 h-4 mr-1" />
              {showArchivedContexts ? "Hide" : "Show"} archived
            </Button>
          )}
        </div>
      </div>

      {contexts.map((context) => {
        const isControlled = onCollapsedStateChange !== undefined;
        const collapsedValue = collapsedState[context.id] ?? false;

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

      {showArchivedContexts && archivedContexts.length > 0 && (
        <ArchivedContexts
          archivedContexts={archivedContexts}
          allContexts={[...contexts, ...archivedContexts]}
        />
      )}
    </div>
  );
}