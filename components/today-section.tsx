import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TaskCard } from "./task-card";
import type { Task } from "@/lib/data";

interface TodaySectionProps {
  tasks: Task[];
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

export function TodaySection({ tasks }: TodaySectionProps) {
  const todayTasks = getTodayTasks(tasks);
  const completedCount = todayTasks.filter(task => task.completed).length;

  return (
    <Card className="border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Today</h2>
        </div>
        <div className="text-sm text-gray-500">
          {completedCount}/{todayTasks.length} completed
        </div>
      </div>

      <CardContent className="p-0">
        {todayTasks.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {todayTasks.map((task) => (
              <div key={task.id} className="px-4 py-2">
                <TaskCard task={task} />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No tasks scheduled for today</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}