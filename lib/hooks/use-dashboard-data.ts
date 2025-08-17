import useSWR from "swr";
import { Task, Context, Tag } from "@/lib/data";

interface DashboardData {
  tasks: Task[];
  contexts: Context[];
  archivedContexts: Context[];
  tags: Tag[];
}

// Types for raw data from API (with date strings instead of Date objects)
type RawTask = Omit<
  Task,
  "dueDate" | "completedAt" | "createdAt" | "updatedAt" | "nextDue"
> & {
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  nextDue: string | null;
};

type RawContext = Omit<Context, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

type RawTag = Omit<Tag, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

function transformTask(task: RawTask): Task {
  return {
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate) : null,
    completedAt: task.completedAt ? new Date(task.completedAt) : null,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    nextDue: task.nextDue ? new Date(task.nextDue) : null,
  };
}

function transformContext(context: RawContext): Context {
  return {
    ...context,
    createdAt: new Date(context.createdAt),
    updatedAt: new Date(context.updatedAt),
  };
}

function transformTag(tag: RawTag): Tag {
  return {
    ...tag,
    createdAt: new Date(tag.createdAt),
    updatedAt: new Date(tag.updatedAt),
  };
}

const fetcher = async (url: string): Promise<DashboardData> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  const data: {
    tasks: RawTask[];
    contexts: RawContext[];
    archivedContexts: RawContext[];
    tags: RawTag[];
  } = await response.json();

  // Transform date strings back to Date objects
  return {
    tasks: data.tasks.map(transformTask),
    contexts: data.contexts.map(transformContext),
    archivedContexts: data.archivedContexts.map(transformContext),
    tags: data.tags.map(transformTag),
  };
};

export function useDashboardData() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(
    "/api/dashboard",
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
    tags: data?.tags || [],
    isLoading,
    isError: error,
    mutate, // Expose mutate for manual refreshes
  };
}
