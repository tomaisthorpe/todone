"use client";

import React from "react";
import { 
  RotateCcw,
  Dumbbell,
  BookOpen,
  Flame,
  Wrench
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, getUrgencyColor } from "@/lib/utils";
import { getHabitStatus, getHabitDisplay } from "@/lib/habits";
import { cn } from "@/lib/utils";
import { TaskToggleButton } from "./task-toggle-button";
import type { Task } from "@/lib/data";

interface TaskCardProps {
  task: Task;
  compact?: boolean;
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

export function TaskCard({ task }: TaskCardProps) {
  const dateInfo = task.dueDate ? {
    text: formatDate(task.dueDate),
    isOverdue: task.dueDate < new Date()
  } : null;
  
  const habitStatus = task.type === "HABIT" ? getHabitStatus({
    lastCompleted: task.lastCompleted || null,
    frequency: task.frequency || null
  }) : null;
  
  const habitDisplay = getHabitDisplay(task);

  return (
    <div className="flex items-start space-x-3 py-2">
      <div className="flex-shrink-0 mt-0.5">
        <TaskToggleButton taskId={task.id} completed={task.completed} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Task title and type indicators */}
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={cn(
                  "font-medium text-sm truncate",
                  task.completed
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                )}
              >
                {task.title}
              </h3>
              
              {task.type === "RECURRING" && (
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <RotateCcw className="w-3 h-3 text-purple-500" />
                  <span className="text-xs text-purple-600 font-medium">
                    {task.frequency}d
                  </span>
                </div>
              )}
              
              {habitDisplay && (
                <div
                  className={cn(
                    "flex items-center space-x-1 flex-shrink-0",
                    habitDisplay.showLarge &&
                      "bg-red-50 px-2 py-0.5 rounded border border-red-200"
                  )}
                >
                  {renderHabitIcon(
                    habitDisplay.iconType,
                    cn(
                      habitDisplay.showLarge ? "w-3.5 h-3.5" : "w-3 h-3",
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
            
            {/* Project and tags row */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {task.project && (
                <span>{task.project}</span>
              )}
              {task.project && task.tags.length > 0 && (
                <span>•</span>
              )}
              {task.tags.slice(0, 2).map((tag, index) => (
                <span key={tag}>
                  {index > 0 && ", "}
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right side: status badges */}
          <div className="flex items-center gap-1.5 ml-3 flex-shrink-0">
            {habitStatus && (
              <Badge
                variant="outline"
                className={cn("text-xs font-medium px-1.5 py-0.5", habitStatus.color)}
              >
                {habitStatus.text}
              </Badge>
            )}
            
            {dateInfo && (
              <Badge
                variant={dateInfo.isOverdue ? "destructive" : "secondary"}
                className="text-xs font-medium px-1.5 py-0.5"
              >
                {dateInfo.text}
              </Badge>
            )}
            
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-semibold px-1.5 py-0.5",
                getUrgencyColor(task.urgency)
              )}
            >
              {task.urgency.toFixed(1)}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}