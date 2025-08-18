/**
 * Utility functions for PWA badge management
 */

import { Task } from "@/lib/data";
import { diffInLocalCalendarDays } from "@/lib/date-utils";
import { shouldHideCompletedTask, shouldHabitShowAsAvailable } from "@/lib/utils";

/**
 * Counts tasks that are due today or overdue and not completed
 */
export function countDueAndOverdueTasks(tasks: Task[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks.filter((task) => {
    // Skip tasks that should be hidden
    if (shouldHideCompletedTask(task)) {
      return false;
    }

    // For habits, check if they're effectively incomplete
    if (task.type === "HABIT") {
      const effectivelyCompleted = task.completed && !shouldHabitShowAsAvailable(task);
      if (effectivelyCompleted) {
        return false;
      }
    } else if (task.completed) {
      // Regular completed tasks don't count
      return false;
    }

    // Check if task has a due date and is due today or overdue
    if (!task.dueDate) return false;
    
    const diffDays = diffInLocalCalendarDays(task.dueDate);
    return diffDays <= 0; // Due today (0) or overdue (negative)
  }).length;
}

// Extend Navigator interface to include Badge API
declare global {
  interface Navigator {
    setAppBadge?: (contents?: number) => Promise<void>;
    clearAppBadge?: () => Promise<void>;
  }
}

/**
 * Updates the PWA badge with the given count
 */
export async function updatePWABadge(count: number): Promise<void> {
  // Check if the Badge API is supported
  if (navigator.setAppBadge) {
    try {
      if (count > 0) {
        await navigator.setAppBadge(count);
      } else {
        // Clear the badge when count is 0
        await navigator.clearAppBadge?.();
      }
    } catch (error) {
      console.warn('Failed to update PWA badge:', error);
    }
  }
}

/**
 * Clears the PWA badge
 */
export async function clearPWABadge(): Promise<void> {
  if (navigator.clearAppBadge) {
    try {
      await navigator.clearAppBadge();
    } catch (error) {
      console.warn('Failed to clear PWA badge:', error);
    }
  }
}