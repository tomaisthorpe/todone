"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { TaskCard } from "./task-card";
import { shouldHideCompletedTask, shouldHabitShowAsAvailable } from "@/lib/utils";
import type { Task } from "@/lib/data";
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
  onContextClick,
}: TodaySectionProps) {
  const [activeTab, setActiveTab] = useState<"urgency" | "today">("urgency");

  const urgentTasks = getUrgentTasks(tasks);
  const todayTasks = getTodayTasks(tasks);

  const currentTasks = activeTab === "urgency" ? urgentTasks : todayTasks;

  const completedCount = currentTasks.filter((task) => task.completed).length;
  const overdueCount =
    activeTab === "today"
      ? todayTasks.filter((task) => {
          if (!task.dueDate || task.completed) return false;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() < today.getTime();
        }).length
      : 0;

  const [showAll, setShowAll] = useState(false);
  const visibleTasks = showAll ? currentTasks : currentTasks.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {activeTab === "urgency" ? "Top by Urgency" : "Today & Overdue"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              {completedCount}/{currentTasks.length} completed
              {activeTab === "today" && overdueCount > 0 && (
                <span className="text-red-500 ml-2">
                  ({overdueCount} overdue)
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="inline-flex rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("urgency")}
              className={
                "px-3 py-1.5 text-sm rounded-md transition-colors " +
                (activeTab === "urgency"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-600 hover:text-gray-900")
              }
            >
              Urgency
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("today")}
              className={
                "px-3 py-1.5 text-sm rounded-md transition-colors " +
                (activeTab === "today"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-600 hover:text-gray-900")
              }
            >
              Today & Overdue
            </button>
          </div>
        </div>
      </div>

      <div className="py-4 px-2 md:p-6">
        {currentTasks.length > 0 ? (
          <div className="space-y-1">
            {visibleTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                contexts={contexts}
                showContext={true}
                onContextClick={onContextClick}
              />
            ))}
            {currentTasks.length > 5 && (
              <div className="pt-2 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 text-xs"
                  onClick={() => setShowAll((v) => !v)}
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      <span>Show less</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      <span>{`Show all (${currentTasks.length})`}</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {activeTab === "urgency"
                ? "No tasks to focus on"
                : "No tasks scheduled for today"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
