import React from "react";
import { Calendar } from "lucide-react";
import { TaskCard } from "./task-card";
import type { Task } from "@/lib/data";

interface TodaySectionProps {
  tasks: Task[];
}

function getTodayTasks(tasks: Task[]): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return tasks
    .filter((task) => {
      // Hide tasks completed yesterday
      if (task.completed && task.updatedAt) {
        const completedDate = new Date(task.updatedAt);
        completedDate.setHours(0, 0, 0, 0);
        if (completedDate.getTime() === yesterday.getTime()) {
          return false;
        }
      }

      // Include tasks due today or overdue
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() <= today.getTime();
    })
    .sort((a, b) => {
      // Sort completed tasks to bottom
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      // Sort by urgency (highest first)
      return b.urgency - a.urgency;
    });
}

export function TodaySection({ tasks }: TodaySectionProps) {
  const todayTasks = getTodayTasks(tasks);
  const completedCount = todayTasks.filter(task => task.completed).length;
  const overdueCount = todayTasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() < today.getTime();
  }).length;

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Today & Overdue</h2>
          </div>
          <div className="text-sm text-gray-500">
            {completedCount}/{todayTasks.length} completed
            {overdueCount > 0 && <span className="text-red-500 ml-2">({overdueCount} overdue)</span>}
          </div>
        </div>
      </div>

      <div className="p-6">
        {todayTasks.length > 0 ? (
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No tasks scheduled for today</p>
          </div>
        )}
      </div>
    </div>
  );
}