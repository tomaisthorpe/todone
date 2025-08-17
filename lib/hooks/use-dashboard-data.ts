import useSWR from 'swr';
import { Task, Context } from '@/lib/data';

interface DashboardData {
  tasks: Task[];
  contexts: Context[];
  archivedContexts: Context[];
}

const fetcher = async (url: string): Promise<DashboardData> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  
  return response.json();
};

export function useDashboardData() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(
    '/api/dashboard',
    fetcher,
    {
      // Refresh every 5 seconds when the tab is active
      refreshInterval: 5000,
      // Refresh when the window gets focus
      revalidateOnFocus: true,
      // Refresh when reconnecting to the internet
      revalidateOnReconnect: true,
      // Don't refresh on mount if we have cached data
      revalidateOnMount: true,
      // Keep previous data while revalidating
      keepPreviousData: true,
      // Don't show loading state when revalidating in background
      revalidateIfStale: true,
    }
  );

  return {
    tasks: data?.tasks || [],
    contexts: data?.contexts || [],
    archivedContexts: data?.archivedContexts || [],
    isLoading,
    isError: error,
    mutate, // Expose mutate for manual refreshes
  };
}