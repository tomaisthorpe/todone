/**
 * Habit-specific utility functions for completion logic and streak calculation
 */

import { startOfDay, endOfDay, addDays } from './date-utils';
import { prisma } from './prisma';
import { HabitStatus } from './habits';

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
  
  // Update the task with new streak info (no longer setting completed/completedAt)
  await prisma.task.update({
    where: { id: taskId },
    data: {
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
  // Remove the most recent habit completion record
  const latestCompletion = await prisma.habitCompletion.findFirst({
    where: { taskId },
    orderBy: { completedAt: 'desc' },
  });
  
  if (latestCompletion) {
    await prisma.habitCompletion.delete({
      where: { id: latestCompletion.id },
    });
  }
  
  // Update the task to reflect the reduced streak (no longer setting completed fields)
  await prisma.task.update({
    where: { id: taskId },
    data: {
      streak: Math.max((task.streak || 1) - 1, 0),
    },
  });
}

/**
 * Gets the most recent habit completion for a habit task
 */
export async function getLatestHabitCompletion(taskId: string): Promise<Date | null> {
  const latestCompletion = await prisma.habitCompletion.findFirst({
    where: { taskId },
    orderBy: { completedAt: 'desc' },
    select: { completedAt: true },
  });
  
  return latestCompletion?.completedAt || null;
}

/**
 * Checks if a habit was completed today based on habit completions
 */
export async function isHabitCompletedToday(taskId: string): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const completion = await prisma.habitCompletion.findFirst({
    where: {
      taskId,
      completedAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });
  
  return !!completion;
}

/**
 * Gets all habit completions for a task within a date range
 */
export async function getHabitCompletions(
  taskId: string,
  startDate?: Date,
  endDate?: Date
): Promise<Date[]> {
  const where: { taskId: string; completedAt?: { gte?: Date; lte?: Date } } = { taskId };
  
  if (startDate || endDate) {
    where.completedAt = {};
    if (startDate) where.completedAt.gte = startDate;
    if (endDate) where.completedAt.lte = endDate;
  }
  
  const completions = await prisma.habitCompletion.findMany({
    where,
    orderBy: { completedAt: 'desc' },
    select: { completedAt: true },
  });
  
  return completions.map(c => c.completedAt);
}

/**
 * Determines if a habit should show as available (not completed for current period)
 * based on habit completions instead of the completed field
 */
export async function shouldHabitShowAsAvailableFromCompletions(
  taskId: string,
  frequency: number | null
): Promise<boolean> {
  const latestCompletion = await getLatestHabitCompletion(taskId);
  
  if (!latestCompletion) {
    // No completions yet, show as available
    return true;
  }
  
  if (!frequency) {
    // No frequency specified, check if completed today
    return !(await isHabitCompletedToday(taskId));
  }
  
  // Calculate if we're in the next period after completion
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  
  const completedDate = new Date(latestCompletion);
  completedDate.setHours(0, 0, 0, 0);
  
  // Show as available after the frequency period has passed
  const nextAvailableDate = new Date(completedDate);
  nextAvailableDate.setDate(nextAvailableDate.getDate() + frequency);
  
  return today >= nextAvailableDate;
}

/**
 * Gets habit status based on habit completions instead of completed/completedAt fields
 */
export async function getHabitStatusFromCompletions(
  taskId: string,
  frequency: number | null
): Promise<HabitStatus | null> {
  if (!frequency) return null;
  
  const latestCompletion = await getLatestHabitCompletion(taskId);
  if (!latestCompletion) return null;
  
  const today = new Date();
  const completedAt = new Date(latestCompletion);
  
  const nextDueDate = new Date(completedAt);
  nextDueDate.setDate(nextDueDate.getDate() + frequency);
  const daysUntilDue = Math.ceil(
    (nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilDue > 1) {
    return {
      status: "fresh",
      text: "✓ Fresh",
      color: "text-green-700 bg-green-100",
      actionNeeded: false,
    };
  } else if (daysUntilDue === 1) {
    return {
      status: "getting-due",
      text: "⏰ Getting due",
      color: "text-yellow-700 bg-yellow-100",
      actionNeeded: false,
    };
  } else if (daysUntilDue === 0) {
    return {
      status: "ready",
      text: "⚡ Ready",
      color: "text-blue-700 bg-blue-100",
      actionNeeded: true,
    };
  } else {
    return {
      status: "time-for-another",
      text: "🔄 Time for another",
      color: "text-orange-700 bg-orange-100",
      actionNeeded: true,
    };
  }
}