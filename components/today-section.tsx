"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TaskCard } from "./task-card";

interface Task {
  id: string;
  title: string;
  project?: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  tags: string[];
  contextId: string;
  dueDate: Date | null;
  urgency: number;
  completed: boolean;
  type: "TASK" | "HABIT" | "RECURRING";
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  habitType?: "STREAK" | "LEARNING" | "WELLNESS" | "MAINTENANCE" | null;
  streak?: number | null;
  longestStreak?: number | null;
  frequency?: number | null;
  lastCompleted?: Date | null;
  nextDue?: Date | null;
  context?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

interface TodaySectionProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
}

function getTodayTasks(tasks: Task[]): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return tasks
    .filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    })
    .sort((a, b) => {
      // Sort completed tasks to bottom
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      // Sort by urgency (highest first)
      return b.urgency - a.urgency;
    });
}

export function TodaySection({ tasks, onToggleTask }: TodaySectionProps) {
  const todayTasks = getTodayTasks(tasks);
  const completedCount = todayTasks.filter(task => task.completed).length;

  return (
    <Card>
      <CardHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Today</h2>
          </div>
          <div className="text-sm text-gray-500">
            {completedCount}/{todayTasks.length} completed
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {todayTasks.length > 0 ? (
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggleTask}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No tasks scheduled for today</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}