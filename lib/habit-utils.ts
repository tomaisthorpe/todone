/**
 * Habit-specific utility functions for completion logic and streak calculation
 */

import { startOfDay, endOfDay, addDays } from './date-utils';
import { prisma } from './prisma';

export interface HabitTask {
  id: string;
  dueDate: Date | null;
  frequency: number | null;
  completedAt: Date | null;
  streak: number | null;
  longestStreak: number | null;
}

export interface HabitCompletionResult {
  streak: number;
  longestStreak: number;
  nextDueDate: Date | null;
  wasOnTime: boolean;
}

/**
 * Determines if a habit completion is considered "on time" based on due date or frequency
 */
export function isHabitCompletionOnTime(
  task: HabitTask,
  completionDate: Date
): boolean {
  if (task.dueDate) {
    return completionDate <= endOfDay(new Date(task.dueDate));
  }
  
  if (task.frequency) {
    if (task.completedAt) {
      const expectedDue = addDays(
        startOfDay(new Date(task.completedAt)),
        task.frequency
      );
      return completionDate <= endOfDay(expectedDue);
    }
    // First completion without a prior window counts as on-time
    return true;
  }
  
  // No due date and no frequency; treat as on-time
  return true;
}

/**
 * Calculates the new streak and longest streak values for a habit completion
 */
export function calculateHabitStreak(
  task: HabitTask,
  completionDate: Date
): { streak: number; longestStreak: number } {
  const isOnTime = isHabitCompletionOnTime(task, completionDate);
  const nextStreak = isOnTime ? (task.streak || 0) + 1 : 1;
  const nextLongest = Math.max(task.longestStreak || 0, nextStreak);
  
  return {
    streak: nextStreak,
    longestStreak: nextLongest,
  };
}

/**
 * Calculates the next due date for a habit based on its frequency
 */
export function calculateNextHabitDueDate(
  frequency: number | null,
  completionDate: Date
): Date | null {
  if (!frequency) return null;
  
  return addDays(completionDate, frequency);
}

/**
 * Processes a habit completion - creates completion record and updates task
 * This is the main function that handles all habit completion logic
 */
export async function processHabitCompletion(
  taskId: string,
  task: HabitTask,
  completionDate: Date
): Promise<HabitCompletionResult> {
  const streakResult = calculateHabitStreak(task, completionDate);
  const nextDueDate = calculateNextHabitDueDate(task.frequency, completionDate);
  
  // Create habit completion record
  await prisma.habitCompletion.create({
    data: {
      taskId: taskId,
      completedAt: completionDate,
    },
  });
  
  // Update the task with new streak and completion info
  await prisma.task.update({
    where: { id: taskId },
    data: {
      completed: true,
      completedAt: completionDate,
      streak: streakResult.streak,
      longestStreak: streakResult.longestStreak,
      dueDate: nextDueDate,
    },
  });
  
  return {
    streak: streakResult.streak,
    longestStreak: streakResult.longestStreak,
    nextDueDate,
    wasOnTime: isHabitCompletionOnTime(task, completionDate),
  };
}

/**
 * Processes habit uncompletion (reverting a completion)
 */
export async function processHabitUncompletion(
  taskId: string,
  task: HabitTask
): Promise<void> {
  await prisma.task.update({
    where: { id: taskId },
    data: {
      completed: false,
      completedAt: null,
      streak: Math.max((task.streak || 1) - 1, 0),
    },
  });
  
  // Note: In a future refactor, we should also remove the most recent 
  // HabitCompletion record to maintain data consistency
}