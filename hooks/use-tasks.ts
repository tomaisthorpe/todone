"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

// Raw API response type (with string dates)
interface TaskApiResponse {
  id: string;
  title: string;
  project?: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  tags: string[];
  contextId: string;
  dueDate: string | null;
  urgency: number;
  completed: boolean;
  type: "TASK" | "HABIT" | "RECURRING";
  userId: string;
  createdAt: string;
  updatedAt: string;
  habitType?: "STREAK" | "LEARNING" | "WELLNESS" | "MAINTENANCE" | null;
  streak?: number | null;
  longestStreak?: number | null;
  frequency?: number | null;
  lastCompleted?: string | null;
  nextDue?: string | null;
  context?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

// Transform API response to have proper Date objects
function transformTask(task: TaskApiResponse): Task {
  return {
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate) : null,
    lastCompleted: task.lastCompleted ? new Date(task.lastCompleted) : null,
    nextDue: task.nextDue ? new Date(task.nextDue) : null,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
  };
}

// Fetch all tasks
export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async (): Promise<Task[]> => {
      const response = await fetch("/api/tasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      return data.map(transformTask);
    },
  });
}

// Create a new task
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData: {
      title: string;
      project?: string;
      priority?: "LOW" | "MEDIUM" | "HIGH";
      tags?: string[];
      contextId: string;
      dueDate?: Date | null;
      type?: "TASK" | "HABIT" | "RECURRING";
      habitType?: "STREAK" | "LEARNING" | "WELLNESS" | "MAINTENANCE";
      frequency?: number;
      nextDue?: Date | null;
    }) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...taskData,
          dueDate: taskData.dueDate?.toISOString(),
          nextDue: taskData.nextDue?.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const data = await response.json();
      return transformTask(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

// Update a task (including toggling completion)
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Task>;
    }) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updates,
          dueDate: updates.dueDate?.toISOString(),
          lastCompleted: updates.lastCompleted?.toISOString(),
          nextDue: updates.nextDue?.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const data = await response.json();
      return transformTask(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

// Delete a task
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

// Toggle task completion
export function useToggleTask() {
  const updateTask = useUpdateTask();

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      return updateTask.mutateAsync({
        id,
        updates: { completed },
      });
    },
  });
}