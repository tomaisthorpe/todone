"use client";

import React from "react";
import { 
  AlertCircle, 
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

export function TaskCard({ task, compact = false }: TaskCardProps) {
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
                  "font-medium text-sm",
                  task.completed
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                )}
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
            
            {!compact && (
              <div className="flex items-center space-x-3 mt-1">
                {task.project && (
                  <span className="text-xs text-gray-500">{task.project}</span>
                )}
                {task.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs px-1.5 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 ml-2">
            {habitStatus && (
              <Badge
                variant="outline"
                className={cn("text-xs font-medium", habitStatus.color)}
              >
                {habitStatus.text}
              </Badge>
            )}
            
            {dateInfo && (
              <Badge
                variant={dateInfo.isOverdue ? "destructive" : "secondary"}
                className="text-xs font-medium"
              >
                {dateInfo.text}
              </Badge>
            )}
            
            <Badge
              variant="outline"
              className={cn("text-xs font-semibold", getUrgencyColor(task.urgency))}
            >
              {task.urgency.toFixed(1)}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}