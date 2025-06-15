import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import { TaskType, Priority, HabitType } from "@prisma/client";

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

// Mock data that matches the mockup
const today = new Date("2025-06-15");
const tomorrow = new Date("2025-06-16");
const yesterday = new Date("2025-06-14");

const mockContexts: Context[] = [
  {
    id: "coding-context",
    name: "Coding",
    description: "Development work",
    icon: "Code",
    color: "bg-blue-500",
    shared: false,
    userId: "demo-user",
    createdAt: today,
    updatedAt: today,
  },
  {
    id: "bathroom-context",
    name: "Bathroom",
    description: "Bathroom tasks & cleaning",
    icon: "Home",
    color: "bg-cyan-500",
    shared: false,
    userId: "demo-user",
    createdAt: today,
    updatedAt: today,
  },
  {
    id: "kitchen-context",
    name: "Kitchen",
    description: "Kitchen & cooking tasks",
    icon: "Coffee",
    color: "bg-green-500",
    shared: false,
    userId: "demo-user",
    createdAt: today,
    updatedAt: today,
  },
  {
    id: "bedroom-context",
    name: "Bedroom",
    description: "Bedroom & sleep routine",
    icon: "Home",
    color: "bg-purple-500",
    shared: false,
    userId: "demo-user",
    createdAt: today,
    updatedAt: today,
  },
];

const mockTasks: Task[] = [
  // Today's priority tasks
  {
    id: "task-1",
    title: "Fix authentication bug in user dashboard",
    project: "SideProject A",
    priority: "HIGH",
    tags: ["bug", "urgent"],
    contextId: "coding-context",
    dueDate: today,
    urgency: 8.5,
    completed: false,
    type: "TASK",
    userId: "demo-user",
    createdAt: today,
    updatedAt: today,
    habitType: null,
    streak: null,
    longestStreak: null,
    frequency: null,
    lastCompleted: null,
    nextDue: null,
  },
  {
    id: "habit-1",
    title: "Morning workout",
    project: "Health",
    priority: "MEDIUM",
    tags: ["fitness"],
    contextId: "bedroom-context",
    dueDate: today,
    urgency: 7.8,
    completed: true,
    type: "HABIT",
    userId: "demo-user",
    createdAt: today,
    updatedAt: today,
    habitType: "STREAK",
    streak: 12,
    longestStreak: 28,
    frequency: 1,
    lastCompleted: today,
    nextDue: null,
  },

  // Coding context
  {
    id: "task-2",
    title: "Deploy staging environment",
    project: "SideProject A",
    priority: "HIGH",
    tags: ["deployment"],
    contextId: "coding-context",
    dueDate: tomorrow,
    urgency: 7.9,
    completed: false,
    type: "TASK",
    userId: "demo-user",
    createdAt: today,
    updatedAt: today,
    habitType: null,
    streak: null,
    longestStreak: null,
    frequency: null,
    lastCompleted: null,
    nextDue: null,
  },
  {
    id: "task-3",
    title: "Review pull requests",
    project: "SideProject B",
    priority: "MEDIUM",
    tags: ["review"],
    contextId: "coding-context",
    dueDate: null,
    urgency: 6.2,
    completed: true,
    type: "TASK",
    userId: "demo-user",
    createdAt: today,
    updatedAt: today,
    habitType: null,
    streak: null,
    longestStreak: null,
    frequency: null,
    lastCompleted: null,
    nextDue: null,
  },
  {
    id: "habit-2",
    title: "Daily coding practice",
    project: "Learning",
    priority: "MEDIUM",
    tags: ["learning", "coding"],
    contextId: "coding-context",
    dueDate: null,
    urgency: 6.5,
    completed: false,
    type: "HABIT",
    userId: "demo-user",
    createdAt: today,
    updatedAt: today,
    habitType: "LEARNING",
    streak: 7,
    longestStreak: 15,
    frequency: 1,
    lastCompleted: yesterday,
    nextDue: null,
  },
  {
    id: "recurring-1",
    title: "Weekly team standup",
    project: "Work",
    priority: "MEDIUM",
    tags: ["meeting", "recurring"],
    contextId: "coding-context",
    dueDate: tomorrow,
    urgency: 6.8,
    completed: false,
    type: "RECURRING",
    userId: "demo-user",
    createdAt: today,
    updatedAt: today,
    habitType: null,
    streak: null,
    longestStreak: null,
    frequency: 7,
    lastCompleted: null,
    nextDue: tomorrow,
  },

  // Kitchen context
  {
    id: "habit-3",
    title: "Wipe down counters",
    project: "Cleaning",
    priority: "MEDIUM",
    tags: ["cleaning"],
    contextId: "kitchen-context",
    dueDate: today,
    urgency: 6.1,
    completed: true,
    type: "HABIT",
    userId: "demo-user",
    createdAt: today,
    updatedAt: today,
    habitType: "MAINTENANCE",
    streak: 5,
    longestStreak: null,
    frequency: 1,
    lastCompleted: today,
    nextDue: null,
  },
  {
    id: "task-4",
    title: "Empty dishwasher",
    project: "Cleaning",
    priority: "MEDIUM",
    tags: ["dishes"],
    contextId: "kitchen-context",
    dueDate: today,
    urgency: 5.8,
    completed: false,
    type: "TASK",
    userId: "demo-user",
    createdAt: today,
    updatedAt: today,
    habitType: null,
    streak: null,
    longestStreak: null,
    frequency: null,
    lastCompleted: null,
    nextDue: null,
  },

  // Bedroom context
  {
    id: "habit-4",
    title: "Make bed",
    project: "Morning Routine",
    priority: "LOW",
    tags: ["routine"],
    contextId: "bedroom-context",
    dueDate: null,
    urgency: 4.2,
    completed: true,
    type: "HABIT",
    userId: "demo-user",
    createdAt: today,
    updatedAt: today,
    habitType: "WELLNESS",
    streak: 8,
    longestStreak: 22,
    frequency: 1,
    lastCompleted: today,
    nextDue: null,
  },
  {
    id: "habit-5",
    title: "Read before bed",
    project: "Learning",
    priority: "LOW",
    tags: ["reading", "routine"],
    contextId: "bedroom-context",
    dueDate: null,
    urgency: 5.2,
    completed: false,
    type: "HABIT",
    userId: "demo-user",
    createdAt: today,
    updatedAt: today,
    habitType: "LEARNING",
    streak: 9,
    longestStreak: 18,
    frequency: 1,
    lastCompleted: yesterday,
    nextDue: null,
  },

  // Bathroom context
  {
    id: "habit-6",
    title: "Evening skincare routine",
    project: "Self-Care",
    priority: "LOW",
    tags: ["skincare", "routine"],
    contextId: "bathroom-context",
    dueDate: null,
    urgency: 4.8,
    completed: false,
    type: "HABIT",
    userId: "demo-user",
    createdAt: today,
    updatedAt: today,
    habitType: "WELLNESS",
    streak: 18,
    longestStreak: 32,
    frequency: 1,
    lastCompleted: yesterday,
    nextDue: null,
  },
];

export async function getTasks(): Promise<Task[]> {
  return mockTasks;
}

export async function getContexts(): Promise<Context[]> {
  return mockContexts;
}

export async function getUserContexts(userId: string): Promise<Context[]> {
  return mockContexts.filter(context => context.userId === userId);
}

export async function getUserTasks(userId: string): Promise<Task[]> {
  return mockTasks.filter(task => task.userId === userId);
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