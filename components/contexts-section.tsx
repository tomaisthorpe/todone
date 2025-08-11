"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Context, Task } from "@/lib/data";
import { ContextGroup } from "@/components/context-group";

interface ContextsSectionProps {
  contexts: Context[];
  tasks: Task[];
}

export function ContextsSection({ contexts, tasks }: ContextsSectionProps) {
  const [collapsedAll, setCollapsedAll] = useState<boolean | null>(null);

  // Build a map of id -> collapsed state based on collapsedAll toggle when set
  const collapsedById = useMemo(() => {
    if (collapsedAll === null) return new Map<string, boolean>();
    const m = new Map<string, boolean>();
    for (const c of contexts) {
      m.set(c.id, collapsedAll);
    }
    return m;
  }, [collapsedAll, contexts]);

  const allCollapsed = collapsedAll === true;
  const allExpanded = collapsedAll === false;

  const handleExpandAll = () => setCollapsedAll(false);
  const handleCollapseAll = () => setCollapsedAll(true);

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
          {contexts.map((context) => (
            <ContextGroup
              key={context.id}
              context={context}
              tasks={tasks}
              allContexts={contexts}
              collapsed={collapsedById.get(context.id) ?? undefined}
              onCollapsedChange={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No contexts yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
}