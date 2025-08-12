"use client";

import { useState } from "react";
import { TodaySection } from "@/components/today-section";
import { AddItemModal } from "@/components/add-item-modal";
import { SmartTaskInput } from "@/components/smart-task-input";
import { ContextsSection } from "@/components/contexts-section";
import type { Task, Context } from "@/lib/data";

interface DashboardClientProps {
  tasks: Task[];
  contexts: Context[];
  archivedContexts: Context[];
}

export function DashboardClient({ tasks, contexts, archivedContexts }: DashboardClientProps) {
  const [collapsedState, setCollapsedState] = useState<Record<string, boolean>>({});

  const scrollToContext = (contextId: string) => {
    // First, ensure the context is expanded
    setCollapsedState(prev => ({
      ...prev,
      [contextId]: false
    }));

    // Small delay to ensure the DOM has updated before scrolling
    setTimeout(() => {
      const element = document.getElementById(`context-${contextId}`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        
        // Add a brief highlight effect
        element.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)';
        setTimeout(() => {
          element.style.boxShadow = '';
        }, 2000);
      }
    }, 100);
  };

  // Sort contexts by health (lowest first), then by highest urgency task
  // This sorting is stable and only calculated on server-side load/reload
  const sortedContexts = [...contexts].sort((a, b) => {
    // Calculate health for each context (server-side snapshot)
    const aHabits = tasks.filter(
      (task) => task.contextId === a.id && task.type === "HABIT"
    );
    const bHabits = tasks.filter(
      (task) => task.contextId === b.id && task.type === "HABIT"
    );

    const aHealth =
      aHabits.length === 0
        ? 100
        : Math.round(
            (aHabits.filter((h) => h.completed).length / aHabits.length) * 100
          );
    const bHealth =
      bHabits.length === 0
        ? 100
        : Math.round(
            (bHabits.filter((h) => h.completed).length / bHabits.length) * 100
          );

    // Sort by health (lowest first)
    if (aHealth !== bHealth) {
      return aHealth - bHealth;
    }

    // If health is equal, sort by highest urgency task in context
    const aMaxUrgency = Math.max(
      ...tasks
        .filter((task) => task.contextId === a.id)
        .map((task) => task.urgency),
      0
    );
    const bMaxUrgency = Math.max(
      ...tasks
        .filter((task) => task.contextId === b.id)
        .map((task) => task.urgency),
      0
    );

    return bMaxUrgency - aMaxUrgency;
  });

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Smart Task Input */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <SmartTaskInput contexts={contexts} />
        </div>

        {/* Today Section */}
        <TodaySection tasks={tasks} contexts={contexts} onContextClick={scrollToContext} />

        {/* Context Groups */}
        <ContextsSection 
          contexts={sortedContexts} 
          tasks={tasks} 
          collapsedState={collapsedState}
          onCollapsedStateChange={setCollapsedState}
          archivedContexts={archivedContexts}
        />
      </div>
      <div className="flex justify-center mt-2 pb-16">
        <AddItemModal contexts={contexts} />
      </div>
    </>
  );
}