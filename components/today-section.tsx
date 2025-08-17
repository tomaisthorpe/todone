"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { TaskCard } from "./task-card";
import { shouldHideCompletedTask, shouldHabitShowAsAvailable } from "@/lib/utils";
import type { Task, Tag } from "@/lib/data";
import { Button } from "@/components/ui/button";

interface TodaySectionProps {
  tasks: Task[];
  contexts: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
    coefficient: number;
    isInbox: boolean;
  }>;
  tags: Tag[];
  onContextClick?: (contextId: string) => void;
}

function getTodayTasks(tasks: Task[]): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks
    .filter((task) => {
      // Hide completed tasks from previous days (except if completed within the last hour)
      if (shouldHideCompletedTask(task)) {
        return false;
      }

      // Include tasks due today or overdue
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() <= today.getTime();
    })
    .sort((a, b) => {
      // For habits, consider them incomplete if they're available for completion
      const aEffectivelyCompleted = a.type === "HABIT" ? 
        a.completed && !shouldHabitShowAsAvailable(a) : 
        a.completed;
      const bEffectivelyCompleted = b.type === "HABIT" ? 
        b.completed && !shouldHabitShowAsAvailable(b) : 
        b.completed;
      
      // Sort completed tasks to bottom
      if (aEffectivelyCompleted !== bEffectivelyCompleted) return aEffectivelyCompleted ? 1 : -1;
      // Sort by urgency (highest first)
      return b.urgency - a.urgency;
    });
}

function getUrgentTasks(tasks: Task[]): Task[] {
  return tasks
    .filter((task) => {
      // Hide completed tasks from previous days (except if completed within the last hour)
      if (shouldHideCompletedTask(task)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      // For habits, consider them incomplete if they're available for completion
      const aEffectivelyCompleted = a.type === "HABIT" ? 
        a.completed && !shouldHabitShowAsAvailable(a) : 
        a.completed;
      const bEffectivelyCompleted = b.type === "HABIT" ? 
        b.completed && !shouldHabitShowAsAvailable(b) : 
        b.completed;
      
      // Sort completed tasks to bottom
      if (aEffectivelyCompleted !== bEffectivelyCompleted) return aEffectivelyCompleted ? 1 : -1;
      // Sort by urgency (highest first)
      return b.urgency - a.urgency;
    });
}

export function TodaySection({
  tasks,
  contexts,
  tags,
  onContextClick,
}: TodaySectionProps) {
  const [activeTab, setActiveTab] = useState<"urgency" | "today">("urgency");

  const urgentTasks = getUrgentTasks(tasks);
  const todayTasks = getTodayTasks(tasks);

  const currentTasks = activeTab === "urgency" ? urgentTasks : todayTasks;
  const [showAll, setShowAll] = useState(false);
  const visibleTasks = showAll ? currentTasks : currentTasks.slice(0, 5);

  if (urgentTasks.length === 0 && todayTasks.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header with tabs */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Focus</h2>
          </div>
          
          {/* Tab buttons */}
          <div className="flex bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("urgency")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                activeTab === "urgency"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              High Urgency ({urgentTasks.length})
            </button>
            <button
              onClick={() => setActiveTab("today")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                activeTab === "today"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Due Today ({todayTasks.length})
            </button>
          </div>
        </div>
        
        {/* Tab descriptions */}
        <div className="mt-2">
          {activeTab === "urgency" && (
            <p className="text-sm text-gray-600">
              Tasks with urgency score ≥ 10 - your highest priority items
            </p>
          )}
          {activeTab === "today" && (
            <p className="text-sm text-gray-600">
              Tasks due today or overdue - don't let these slip
            </p>
          )}
        </div>
      </div>

      {/* Task list */}
      <div className="p-4">
        {currentTasks.length > 0 ? (
          <>
            <div className="space-y-1">
              {visibleTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  contexts={contexts}
                  tags={tags}
                  showContext={true}
                  onContextClick={onContextClick}
                />
              ))}
            </div>
            
            {/* Show more/less button */}
            {currentTasks.length > 5 && (
              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Show {currentTasks.length - 5} more
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>
              {activeTab === "urgency" 
                ? "No high-urgency tasks right now - great job!" 
                : "No tasks due today - you're all caught up!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
