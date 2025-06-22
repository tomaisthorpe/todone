import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import { calculateUrgency } from "./utils";

// Get authenticated user session
async function getAuthenticatedSession() {
  const session = (await getServerSession(authOptions)) as Session | null;
  return session;
}

// Server-side data types
export interface Task {
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
}

export interface Context {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  shared: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getTasks(): Promise<Task[]> {
  const session = await getAuthenticatedSession();

  if (!session?.user?.id) {
    return [];
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
    });

    const tasksWithUrgency = tasks.map((task) => ({
      ...task,
      priority: task.priority as "LOW" | "MEDIUM" | "HIGH",
      type: task.type as "TASK" | "HABIT" | "RECURRING",
      habitType: task.habitType as
        | "STREAK"
        | "LEARNING"
        | "WELLNESS"
        | "MAINTENANCE"
        | null,
      urgency: calculateUrgency({
        priority: task.priority as "LOW" | "MEDIUM" | "HIGH",
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        tags: task.tags,
      }),
    }));

    return tasksWithUrgency.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return b.urgency - a.urgency;
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export async function getContexts(): Promise<Context[]> {
  const session = await getAuthenticatedSession();

  if (!session?.user?.id) {
    return [];
  }

  try {
    const contexts = await prisma.context.findMany({
      where: {
        OR: [{ userId: session.user.id }, { shared: true }],
      },
      orderBy: { name: "asc" },
    });

    return contexts;
  } catch (error) {
    console.error("Error fetching contexts:", error);
    return [];
  }
}

export async function getUserContexts(userId: string): Promise<Context[]> {
  try {
    const contexts = await prisma.context.findMany({
      where: {
        OR: [{ userId: userId }, { shared: true }],
      },
      orderBy: { name: "asc" },
    });

    return contexts;
  } catch (error) {
    console.error("Error fetching user contexts:", error);
    return [];
  }
}

export async function getUserTasks(userId: string): Promise<Task[]> {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: userId,
      },
      orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
    });

    const tasksWithUrgency = tasks.map((task) => ({
      ...task,
      priority: task.priority as "LOW" | "MEDIUM" | "HIGH",
      type: task.type as "TASK" | "HABIT" | "RECURRING",
      habitType: task.habitType as
        | "STREAK"
        | "LEARNING"
        | "WELLNESS"
        | "MAINTENANCE"
        | null,
      urgency: calculateUrgency({
        priority: task.priority as "LOW" | "MEDIUM" | "HIGH",
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        tags: task.tags,
      }),
    }));

    return tasksWithUrgency.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return b.urgency - a.urgency;
    });
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    return [];
  }
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
