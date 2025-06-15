"use client";

import React, { useState } from "react";
import { 
  RotateCcw,
  Dumbbell,
  BookOpen,
  Flame,
  Wrench,
  AlertCircle
} from "lucide-react";
import { formatDateForTask } from "@/lib/utils";
import { getHabitStatus, getHabitDisplay } from "@/lib/habits";
import { cn } from "@/lib/utils";
import { TaskToggleButton } from "./task-toggle-button";
import { TaskModal } from "./add-item-modal";
import type { Task } from "@/lib/data";

interface TaskCardProps {
  task: Task;
  contexts: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
}

const renderHabitIcon = (iconType: string, className: string) => {
  switch (iconType) {
    case "dumbbell":
      return <Dumbbell className={className} />;
    case "book":
      return <BookOpen className={className} />;
    case "flame":
      return <Flame className={className} />;
    case "wrench":
      return <Wrench className={className} />;
    default:
      return <Flame className={className} />;
  }
};

export function TaskCard({ task, contexts }: TaskCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dateInfo = formatDateForTask(task.dueDate);
  const habitStatus = task.type === "HABIT" ? getHabitStatus({
    lastCompleted: task.lastCompleted,
    frequency: task.frequency
  }) : null;
  const habitDisplay = getHabitDisplay(task);

  return (
    <>
      <div
        className={cn(
          "flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg",
          task.completed && "opacity-60"
        )}
      >
        <TaskToggleButton taskId={task.id} completed={task.completed} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3
                  className={cn(
                    "font-medium text-sm cursor-pointer hover:text-blue-600 transition-colors",
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-900"
                  )}
                  onClick={() => setIsEditModalOpen(true)}
                  title="Click to edit task"
                >
                  {task.title}
                </h3>
                
                {task.type === "RECURRING" && (
                  <div className="flex items-center space-x-1">
                    <RotateCcw className="w-3 h-3 text-purple-500" />
                    <span className="text-xs text-purple-600 font-medium">
                      Every {task.frequency}d
                    </span>
                  </div>
                )}
                
                {habitDisplay && (
                  <div
                    className={cn(
                      "flex items-center space-x-1",
                      habitDisplay.showLarge &&
                        "bg-red-50 px-2 py-1 rounded-md border border-red-200"
                    )}
                  >
                    {renderHabitIcon(
                      habitDisplay.iconType,
                      cn(
                        habitDisplay.showLarge ? "w-4 h-4" : "w-3 h-3",
                        habitDisplay.iconColor
                      )
                    )}
                    <span
                      className={cn(
                        habitDisplay.showLarge
                          ? "text-sm font-bold text-red-700"
                          : "text-xs font-medium text-orange-600"
                      )}
                    >
                      {habitDisplay.primaryText}
                    </span>
                    {habitDisplay.secondaryText && (
                      <span className="text-xs text-gray-500">
                        {habitDisplay.secondaryText}
                      </span>
                    )}
                  </div>
                )}
                
                {dateInfo?.isOverdue && (
                  <AlertCircle className="w-3 h-3 text-red-500" />
                )}
              </div>
              
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-xs text-gray-500">{task.project}</span>
                {task.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-2">
              {habitStatus && (
                <div
                  className={cn(
                    "px-1.5 py-0.5 rounded text-xs font-medium",
                    habitStatus.color
                  )}
                >
                  {habitStatus.text}
                </div>
              )}
              {dateInfo && (
                <div
                  className={cn(
                    "px-1.5 py-0.5 rounded text-xs font-medium",
                    dateInfo.color
                  )}
                >
                  {dateInfo.text}
                </div>
              )}
              <div
                className={cn(
                  "px-1.5 py-0.5 rounded text-xs font-semibold",
                  task.urgency >= 7
                    ? "text-red-600 bg-red-100"
                    : task.urgency >= 5
                    ? "text-orange-600 bg-orange-100"
                    : "text-green-600 bg-green-100"
                )}
              >
                {task.urgency.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskModal
        contexts={contexts}
        task={task}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}