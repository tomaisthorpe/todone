import { useEffect, useCallback } from 'react';
import { Task } from '@/lib/data';
import { countDueAndOverdueTasks, updatePWABadge } from '@/lib/badge-utils';

/**
 * Hook to automatically update PWA badge based on tasks
 */
export function usePWABadge(tasks: Task[]) {
  // Function to manually update badge
  const updateBadge = useCallback(async () => {
    const badgeCount = countDueAndOverdueTasks(tasks);
    await updatePWABadge(badgeCount);
  }, [tasks]);

  // Update badge when tasks change
  useEffect(() => {
    // Only update badge if we have tasks data and the page is visible
    if (tasks.length === 0) return;
    
    updateBadge();
  }, [tasks, updateBadge]);

  // Update badge when page becomes visible (user returns to app)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && tasks.length > 0) {
        updateBadge();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updateBadge, tasks]);

  // Update badge when the app gains focus
  useEffect(() => {
    const handleFocus = () => {
      if (tasks.length > 0) {
        updateBadge();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [updateBadge, tasks]);

  // Periodic badge update (every 5 minutes) to handle time-based changes
  // (e.g., tasks becoming overdue)
  useEffect(() => {
    if (tasks.length === 0) return;

    const interval = setInterval(() => {
      updateBadge();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [updateBadge, tasks]);

  return { updateBadge };
}