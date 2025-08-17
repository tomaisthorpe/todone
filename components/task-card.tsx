"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  Dumbbell,
  BookOpen,
  Flame,
  Wrench,
  FileText,
  CheckSquare,
} from "lucide-react";
import {
  formatDateForTask,
  evaluateUrgency,
  getUrgencyColor,
  shouldHabitShowAsAvailable,
} from "@/lib/utils";
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
import type { Task, Tag as TagType } from "@/lib/data";

interface TaskCardProps {
  task: Task;
  contexts: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
    coefficient: number;
    isInbox: boolean;
  }>;
  tags?: TagType[];
  showContext?: boolean;
  onContextClick?: (contextId: string) => void;
  showUrgency?: boolean;
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

// Helper function to render compact subtask display
const renderSubtaskDisplay = (subtasks: Array<{id: string; text: string; completed: boolean}>) => {
  if (!subtasks || subtasks.length === 0) return null;

  const completedCount = subtasks.filter(s => s.completed).length;
  const totalCount = subtasks.length;
  const completionPercentage = (completedCount / totalCount) * 100;

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
          <CheckSquare className="w-3 h-3" />
          <span>{completedCount}/{totalCount}</span>
          {totalCount > 0 && (
            <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-xs max-w-xs">
          <div className="font-medium mb-1">Subtasks ({completedCount}/{totalCount})</div>
          {subtasks.slice(0, 5).map((subtask) => (
            <div key={subtask.id} className="flex items-center space-x-1 py-0.5">
              <span className={subtask.completed ? "text-green-500" : "text-gray-400"}>
                {subtask.completed ? "✓" : "○"}
              </span>
              <span className={subtask.completed ? "line-through text-gray-400" : ""}>
                {subtask.text.length > 30 ? `${subtask.text.substring(0, 30)}...` : subtask.text}
              </span>
            </div>
          ))}
          {subtasks.length > 5 && (
            <div className="text-gray-400 text-center pt-1">
              ... and {subtasks.length - 5} more
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export function TaskCard({
  task,
  contexts,
  tags = [],
  showContext = false,
  showUrgency = true,
  onContextClick,
}: TaskCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dateInfo = formatDateForTask(task.dueDate);
  const habitStatus =
    task.type === "HABIT"
      ? getHabitStatus({
          completedAt: task.completedAt,
          frequency: task.frequency,
        })
      : null;
  const habitDisplay = getHabitDisplay(task);

  // For habits, calculate whether they should show as available (uncompleted) or completed
  const effectiveCompleted =
    task.type === "HABIT"
      ? !shouldHabitShowAsAvailable({
          completed: task.completed,
          completedAt: task.completedAt,
          type: task.type,
        })
      : task.completed;

  // Find the context for this task to get its coefficient
  const taskContext = contexts.find((ctx) => ctx.id === task.contextId);

  // Build tag coefficients map
  const tagCoefficients: { [tagName: string]: number } = {};
  tags.forEach((tag) => {
    tagCoefficients[tag.name.toLowerCase()] = tag.coefficient;
  });

  const urgencyExplanation = evaluateUrgency({
    priority: task.priority,
    dueDate: task.dueDate,
    createdAt: task.createdAt,
    tags: task.tags,
    project: task.project,
    contextCoefficient: taskContext?.coefficient || 0,
    tagCoefficients,
  });

  // Get context icon component for display
  const ContextIconComponent = taskContext
    ? getContextIconComponent(taskContext.icon)
    : null;

  return (
    <TooltipProvider>
      <div className="flex items-start space-x-3 py-2 sm:px-3 hover:bg-gray-50 rounded-lg">
        <div className={cn(effectiveCompleted && "opacity-60")}>
          <TaskToggleButton taskId={task.id} completed={effectiveCompleted} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className={cn("flex-1", effectiveCompleted && "opacity-60")}>
              <div className="flex items-center flex-wrap space-x-2">
                <h3
                  className={cn(
                    "font-medium text-sm cursor-pointer hover:text-blue-600 transition-colors",
                    effectiveCompleted
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
                  <div className="flex items-center space-x-1">
                    {renderHabitIcon(
                      habitDisplay.iconType,
                      cn("w-3 h-3", habitDisplay.iconColor)
                    )}
                    <span className="text-xs font-medium text-gray-600">
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

              {((showContext && taskContext) ||
                task.project ||
                task.tags.length > 0 ||
                task.notes ||
                (task.subtasks && task.subtasks.length > 0)) && (
                <div className="flex flex-wrap items-center space-x-2 md:space-x-3 mt-1">
                  {showContext &&
                    taskContext &&
                    ContextIconComponent &&
                    (onContextClick ? (
                      <button
                        onClick={() => onContextClick(taskContext.id)}
                        className={cn(
                          "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium text-white transition-all hover:scale-105 hover:shadow-md mb-1",
                          taskContext.color
                        )}
                        title={`Click to scroll to ${taskContext.name} context`}
                      >
                        <ContextIconComponent className="w-3 h-3 mr-1" />
                        {taskContext.name}
                      </button>
                    ) : (
                      <span
                        className={cn(
                          "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium text-white mb-1",
                          taskContext.color
                        )}
                        title={taskContext.name}
                      >
                        <ContextIconComponent className="w-3 h-3 mr-1" />
                        {taskContext.name}
                      </span>
                    ))}
                  {task.project && (
                    <span className="text-xs text-gray-500 mb-1">
                      {task.project}
                    </span>
                  )}
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="block items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600 mb-1"
                    >
                      {tag}
                    </span>
                  ))}
                  {task.notes && (
                    <Tooltip>
                      <TooltipTrigger>
                        <FileText className="w-3 h-3 text-gray-500 mb-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          {task.notes.length > 100
                            ? `${task.notes.substring(0, 100)}...`
                            : task.notes}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {renderSubtaskDisplay(task.subtasks)}
                </div>
              )}
            </div>

            {showUrgency && (
              <div className="flex items-center ml-2 justify-end flex-wrap gap-2 max-w-1/2">
                {habitStatus && (
                  <div
                    className={cn(
                      "text-xs font-medium whitespace-nowrap",
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
            )}
          </div>
        </div>
      </div>

      <TaskModal
        contexts={contexts}
        tags={tags}
        task={task}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </TooltipProvider>
  );
}
