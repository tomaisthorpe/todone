import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "./task-card";
import { cn } from "@/lib/utils";
import { Home, Code, Coffee, Car, Briefcase } from "lucide-react";
import { ContextCollapsible } from "./context-collapsible";
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
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 50) return "text-yellow-600";
  return "text-red-600";
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
    <Card className="overflow-hidden">
      <CardHeader className={cn("p-4 text-white", context.color)}>
        <div className="flex items-center justify-between">
          <ContextCollapsible>
            <IconComponent className="w-5 h-5" />
            <div className="text-left">
              <h3 className="font-semibold">{context.name}</h3>
              {context.description && (
                <p className="text-sm opacity-90">{context.description}</p>
              )}
            </div>
          </ContextCollapsible>
          
          <div className="text-right">
            <Badge
              variant="secondary"
              className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-white",
                getCompletionColor(completion.percentage)
              )}
            >
              {completion.percentage}%
            </Badge>
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

        <div className="mt-3">
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${completion.percentage}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <ContextCollapsible.Content>
        <CardContent className="p-4">
          {contextTasks.length > 0 ? (
            <div className="space-y-1">
              {contextTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  compact
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No tasks in this context
            </p>
          )}
        </CardContent>
      </ContextCollapsible.Content>
    </Card>
  );
}