"use client";

import React, { useState } from "react";
import { RotateCcw, Dumbbell, BookOpen, Flame, Wrench } from "lucide-react";
import { formatDateForTask, evaluateUrgency, getUrgencyColor } from "@/lib/utils";
import { getHabitStatus, getHabitDisplay } from "@/lib/habits";
import { getContextIconComponent } from "@/lib/context-icons";
import { cn } from "@/lib/utils";
import { TaskToggleButton } from "./task-toggle-button";
import { TaskModal } from "./add-item-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Task } from "@/lib/data";

interface TaskCardProps {
  task: Task;
  contexts: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
    coefficient: number;
  }>;
  showContext?: boolean;
  onContextClick?: (contextId: string) => void;
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

export function TaskCard({ task, contexts, showContext = false, onContextClick }: TaskCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dateInfo = formatDateForTask(task.dueDate);
  const habitStatus =
    task.type === "HABIT"
      ? getHabitStatus({
          lastCompleted: task.lastCompleted,
          frequency: task.frequency,
        })
      : null;
  const habitDisplay = getHabitDisplay(task);
  
  // Find the context for this task to get its coefficient
  const taskContext = contexts.find(ctx => ctx.id === task.contextId);
  
  const urgencyExplanation = evaluateUrgency({
    priority: task.priority,
    dueDate: task.dueDate,
    createdAt: task.createdAt,
    tags: task.tags,
    contextCoefficient: taskContext?.coefficient || 0,
  });

  // Get context icon component for display
  const ContextIconComponent = taskContext ? getContextIconComponent(taskContext.icon) : null;

  return (
    <TooltipProvider>
      <div className="flex items-start space-x-3 py-2 px-3 hover:bg-gray-50 rounded-lg">
        <div className={cn(task.completed && "opacity-60") }>
          <TaskToggleButton taskId={task.id} completed={task.completed} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className={cn("flex-1", task.completed && "opacity-60")}>
              <div className="flex items-center flex-wrap space-x-2">
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
              </div>

              {((showContext && taskContext) || task.project || task.tags.length > 0) && (
                <div className="flex items-center space-x-3 mt-1">
                  {showContext && taskContext && ContextIconComponent && (
                    <button
                      onClick={() => onContextClick?.(taskContext.id)}
                      className={cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium text-white transition-all hover:scale-105 hover:shadow-md",
                        taskContext.color
                      )}
                      title={`Click to scroll to ${taskContext.name} context`}
                    >
                      <ContextIconComponent className="w-3 h-3 mr-1" />
                      {taskContext.name}
                    </button>
                  )}
                  {task.project && (
                    <span className="text-xs text-gray-500">
                      {task.project}
                    </span>
                  )}
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center ml-2 justify-end flex-wrap gap-2 max-w-1/2">
              {habitStatus && (
                <div
                  className={cn(
                    "px-1.5 py-0.5 rounded text-xs font-medium whitespace-nowrap",
                    habitStatus.color
                  )}
                >
                  {habitStatus.text}
                </div>
              )}
              {dateInfo && (
                <div
                  className={cn(
                    "px-1.5 py-0.5 rounded text-xs font-medium whitespace-nowrap",
                    dateInfo.color
                  )}
                >
                  {dateInfo.text}
                </div>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "px-1.5 py-0.5 rounded text-xs font-semibold cursor-help",
                      getUrgencyColor(task.urgency)
                    )}
                  >
                    {task.urgency.toFixed(1)}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="text-sm">
                    <div className="font-semibold mb-1">
                      Urgency Calculation:
                    </div>
                    {urgencyExplanation.explanation.map((line, index) => (
                      <div key={index} className="text-xs">
                        {line}
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
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
      </TooltipProvider>
    );
  }
