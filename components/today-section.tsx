"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { TaskCard } from "./task-card";
import { shouldHideCompletedTask } from "@/lib/utils";
import type { Task } from "@/lib/data";
import { Button } from "@/components/ui/button";

interface TodaySectionProps {
  tasks: Task[];
  contexts: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
}

function getTodayTasks(tasks: Task[]): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks
    .filter((task) => {
      // Hide completed tasks from previous days (except if completed within the last hour)
      if (shouldHideCompletedTask(task)) {
        return false;
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

export function TodaySection({ tasks, contexts }: TodaySectionProps) {
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

  const [showAll, setShowAll] = useState(false);
  const visibleTasks = showAll ? todayTasks : todayTasks.slice(0, 5);

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
            {visibleTasks.map((task) => (
              <TaskCard key={task.id} task={task} contexts={contexts} />
            ))}
            {todayTasks.length > 5 && (
              <div className="pt-2 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 text-xs"
                  onClick={() => setShowAll((v) => !v)}
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      <span>Show less</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      <span>{`Show all (${todayTasks.length})`}</span>
                    </>
                  )}
                </Button>
              </div>
            )}
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