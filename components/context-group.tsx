import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TaskCard } from "./task-card";
import { cn } from "@/lib/utils";
import { Home, Code, Coffee, Car, Briefcase, ChevronDown } from "lucide-react";
import { 
  ContextCollapsible, 
  ContextCollapsibleContent, 
  ContextCollapsibleTrigger 
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

  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm">
      <ContextCollapsible>
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", context.color)}>
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{context.name}</h3>
              <p className="text-sm text-gray-500">{contextTasks.length} tasks</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Health percentage for habits only */}
            {completion.total > 0 && (
              <div className="text-right">
                <div className={cn("text-sm font-semibold", getCompletionColor(completion.percentage))}>
                  {completion.percentage}%
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      completion.percentage >= 80 ? "bg-green-500" :
                      completion.percentage >= 50 ? "bg-yellow-500" : "bg-red-500"
                    )}
                    style={{ width: `${completion.percentage}%` }}
                  />
                </div>
              </div>
            )}
            
            <ContextCollapsibleTrigger>
              <ChevronDown className="w-4 h-4 text-gray-400 transition-transform" />
            </ContextCollapsibleTrigger>
          </div>
        </div>

        <ContextCollapsibleContent>
          <CardContent className="p-0">
            {contextTasks.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {contextTasks.map((task) => (
                  <div key={task.id} className="px-4 py-2">
                    <TaskCard
                      task={task}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500">No tasks in this context</p>
              </div>
            )}
          </CardContent>
        </ContextCollapsibleContent>
      </ContextCollapsible>
    </Card>
  );
}