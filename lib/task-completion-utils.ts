/**
 * Task completion utilities to eliminate duplication in server actions
 */

import { prisma } from "./prisma";
import { addDays } from "./date-utils";
import { processHabitCompletion, processHabitUncompletion } from "./habit-utils";

export interface TaskForCompletion {
  id: string;
  title: string;
  project: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  tags: string;
  contextId: string;
  dueDate: Date | null;
  type: "TASK" | "HABIT" | "RECURRING";
  userId: string;
  frequency: number | null;
  completed: boolean;
  completedAt: Date | null;
  streak: number | null;
  longestStreak: number | null;
}

/**
 * Completes a recurring task by creating the next instance and marking current as completed
 */
export async function completeRecurringTask(
  task: TaskForCompletion,
  completionDate: Date
): Promise<void> {
  if (!task.frequency) {
    throw new Error("Recurring task must have a frequency");
  }

  let nextDueDate: Date;

  if (task.dueDate) {
    // If task has a due date, calculate next due date from the original due date
    nextDueDate = addDays(new Date(task.dueDate), task.frequency);
  } else {
    // If task has no due date, calculate next due date from completion date
    nextDueDate = addDays(new Date(completionDate), task.frequency);
  }

  // Create the next recurring task instance
  await prisma.task.create({
    data: {
      title: task.title,
      project: task.project,
      priority: task.priority,
      tags: task.tags,
      contextId: task.contextId,
      dueDate: nextDueDate,
      type: task.type,
      userId: task.userId,
      frequency: task.frequency,
      nextDue: nextDueDate,
    },
  });

  // Mark current recurring task as completed
  await prisma.task.update({
    where: { id: task.id },
    data: {
      completed: true,
      completedAt: completionDate,
    },
  });
}

/**
 * Completes a regular task by marking it as completed
 */
export async function completeRegularTask(
  taskId: string,
  completionDate: Date
): Promise<void> {
  await prisma.task.update({
    where: { id: taskId },
    data: {
      completed: true,
      completedAt: completionDate,
    },
  });
}

/**
 * Toggles task completion state for regular tasks
 */
export async function toggleRegularTask(
  taskId: string,
  isCompleted: boolean,
  completionDate?: Date
): Promise<void> {
  await prisma.task.update({
    where: { id: taskId },
    data: {
      completed: !isCompleted,
      completedAt: !isCompleted ? (completionDate || new Date()) : null,
    },
  });
}

/**
 * Main task completion handler that routes to appropriate completion logic
 */
export async function completeTask(
  task: TaskForCompletion,
  completionDate: Date
): Promise<void> {
  switch (task.type) {
    case "HABIT":
      // For habits, always process the completion (logic in server-actions checks if already completed today)
      await processHabitCompletion(task.id, {
        id: task.id,
        dueDate: task.dueDate,
        frequency: task.frequency,
        completedAt: task.completedAt,
        streak: task.streak,
        longestStreak: task.longestStreak,
      }, completionDate);
      break;
    
    case "RECURRING":
      if (!task.completed && task.frequency) {
        await completeRecurringTask(task, completionDate);
      }
      break;
    
    case "TASK":
      if (!task.completed) {
        await completeRegularTask(task.id, completionDate);
      }
      break;
    
    default:
      throw new Error(`Unknown task type: ${task.type}`);
  }
}

/**
 * Handles habit uncompletion
 */
export async function uncompleteHabit(task: TaskForCompletion): Promise<void> {
  if (task.type === "HABIT") {
    // For habits, always process the uncompletion (logic in server-actions checks if completed today)
    await processHabitUncompletion(task.id, {
      id: task.id,
      dueDate: task.dueDate,
      frequency: task.frequency,
      completedAt: task.completedAt,
      streak: task.streak,
      longestStreak: task.longestStreak,
    });
  }
}