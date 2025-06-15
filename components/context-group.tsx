import React from "react";
import { TaskCard } from "./task-card";
import { cn } from "@/lib/utils";
import { Home, Code, Coffee, Car, Briefcase, ChevronDown } from "lucide-react";
import {
  ContextCollapsible,
  ContextCollapsibleContent,
  ContextCollapsibleTrigger,
} from "./context-collapsible";
import type { Task, Context } from "@/lib/data";

interface ContextGroupProps {
  context: Context;
  tasks: Task[];
}

function getIconComponent(iconName: string) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Home,
    Code,
    Coffee,
    Car,
    Briefcase,
  };

  return iconMap[iconName] || Home;
}

function getContextCompletion(tasks: Task[]) {
  // Only habits contribute to context health, not one-off tasks
  const contextHabits = tasks.filter((task) => task.type === "HABIT");
  if (contextHabits.length === 0) {
    return { percentage: 100, completed: 0, total: 0 };
  }

  const completed = contextHabits.filter((task) => task.completed).length;
  const total = contextHabits.length;
  const percentage = Math.round((completed / total) * 100);

  return { percentage, completed, total };
}

function getCompletionColor(percentage: number): string {
  if (percentage >= 80) return "text-green-700";
  if (percentage >= 50) return "text-yellow-700";
  return "text-red-700";
}

export function ContextGroup({ context, tasks }: ContextGroupProps) {
  const contextTasks = tasks
    .filter((task) => task.contextId === context.id)
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return b.urgency - a.urgency;
    });

  const completion = getContextCompletion(contextTasks);
  const IconComponent = getIconComponent(context.icon);

  // Count tasks scheduled for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTasksInContext = contextTasks.filter((task) => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  }).length;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <ContextCollapsible>
        <div className={cn("p-4 text-white", context.color)}>
          <ContextCollapsibleTrigger>
            <div className="w-full flex items-center justify-between rounded-lg p-2 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <ChevronDown className="w-4 h-4" />
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">{context.name}</h3>
                  <p className="text-sm opacity-90">{context.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-white",
                    getCompletionColor(completion.percentage)
                  )}
                >
                  {completion.percentage}%
                </div>
                <p className="text-xs opacity-90 mt-1">
                  {completion.completed}/{completion.total} habits
                </p>
                {todayTasksInContext > 0 && (
                  <p className="text-xs opacity-90 mt-1">
                    {todayTasksInContext} in Today
                  </p>
                )}
              </div>
            </div>
          </ContextCollapsibleTrigger>

          <div className="mt-3">
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${completion.percentage}%` }}
              />
            </div>
          </div>
        </div>

        <ContextCollapsibleContent>
          <div className="p-4">
            {contextTasks.length > 0 ? (
              <div className="space-y-1">
                {contextTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No tasks in this context
              </p>
            )}
          </div>
        </ContextCollapsibleContent>
      </ContextCollapsible>
    </div>
  );
}
