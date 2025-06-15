import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

// Get authenticated user session
async function getAuthenticatedSession() {
  const session = await getServerSession(authOptions) as Session | null;
  return session;
}

// Type for task with included context
interface TaskWithContext {
  id: string;
  title: string;
  project: string | null;
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
  habitType: "STREAK" | "LEARNING" | "WELLNESS" | "MAINTENANCE" | null;
  streak: number | null;
  longestStreak: number | null;
  frequency: number | null;
  lastCompleted: Date | null;
  nextDue: Date | null;
  context: {
    id: string;
    name: string;
    description: string | null;
    icon: string;
    color: string;
    shared: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

// Server-side data types
export interface Task {
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

export interface Context {
  id: string;
  name: string;
  description?: string | null;
  icon: string;
  color: string;
  shared?: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Fetch all tasks for authenticated user
export async function getTasks(): Promise<Task[]> {
  const session = await getAuthenticatedSession();
  
  if (!session?.user?.id) {
    return [];
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      context: true
    },
    orderBy: {
      urgency: 'desc'
    }
  }) as TaskWithContext[];

  return tasks.map((task) => ({
    ...task,
    context: task.context ? {
      id: task.context.id,
      name: task.context.name,
      icon: task.context.icon,
      color: task.context.color
    } : undefined
  }));
}

// Fetch all contexts for authenticated user
export async function getContexts(): Promise<Context[]> {
  const session = await getAuthenticatedSession();
  
  if (!session?.user?.id) {
    return [];
  }

  const contexts = await prisma.context.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      name: 'asc'
    }
  });

  return contexts;
}

// Get tasks due today
export function getTodayTasks(tasks: Task[]): Task[] {
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

// Get context completion (health)
export function getContextCompletion(tasks: Task[], contextId: string) {
  // Only habits contribute to context health, not one-off tasks
  const contextHabits = tasks.filter(
    (task) => task.contextId === contextId && task.type === "HABIT"
  );
  
  if (contextHabits.length === 0) {
    return { percentage: 100, completed: 0, total: 0 };
  }

  const completed = contextHabits.filter((task) => task.completed).length;
  const total = contextHabits.length;
  const percentage = Math.round((completed / total) * 100);

  return { percentage, completed, total };
}