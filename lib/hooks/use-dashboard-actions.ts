import { useDashboardData } from './use-dashboard-data';
import { toggleTaskAction, createTaskAction, updateTaskAction, deleteTaskAction, createContextAction, updateContextAction } from '@/lib/server-actions';

export function useDashboardActions() {
  const { mutate } = useDashboardData();

  // Wrapper function to handle server actions and trigger revalidation
  const withRevalidation = <T extends unknown[], R>(
    action: (...args: T) => Promise<R>
  ) => {
    return async (...args: T): Promise<R> => {
      const result = await action(...args);
      // Trigger SWR revalidation after the action completes
      mutate();
      return result;
    };
  };

  return {
    toggleTask: withRevalidation(toggleTaskAction),
    createTask: withRevalidation(createTaskAction),
    updateTask: withRevalidation(updateTaskAction),
    deleteTask: withRevalidation(deleteTaskAction),
    createContext: withRevalidation(createContextAction),
    updateContext: withRevalidation(updateContextAction),
  };
}