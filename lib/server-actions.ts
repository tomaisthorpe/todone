'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import { calculateUrgency, parseTags } from "./utils";

// Get authenticated user or redirect
async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions) as Session | null;
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  return session.user.id;
}

// Server action to toggle task completion
export async function toggleTaskAction(taskId: string) {
  const userId = await getAuthenticatedUser();
  
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId }
  });
  
  if (!task) {
    throw new Error("Task not found");
  }
  
  // Handle habit completion logic
  let habitCompletionData = {};
  if (task.type === "HABIT" && !task.completed) {
    // Habit is being completed
    habitCompletionData = {
      lastCompleted: new Date(),
      streak: (task.streak || 0) + 1,
      longestStreak: Math.max((task.longestStreak || 0), (task.streak || 0) + 1)
    };

    // Create habit completion record
    await prisma.habitCompletion.create({
      data: {
        taskId: taskId,
        completedAt: new Date()
      }
    });
  } else if (task.type === "HABIT" && task.completed) {
    // Habit is being uncompleted
    habitCompletionData = {
      streak: Math.max((task.streak || 1) - 1, 0)
    };
  }
  
  await prisma.task.update({
    where: { id: taskId },
    data: {
      completed: !task.completed,
      ...habitCompletionData
    }
  });
  
  revalidatePath("/");
}

// Server action to create a new task
export async function createTaskAction(formData: FormData) {
  const userId = await getAuthenticatedUser();
  
  const title = formData.get("title") as string;
  const project = formData.get("project") as string;
  const priority = (formData.get("priority") as "LOW" | "MEDIUM" | "HIGH") || "MEDIUM";
  const contextId = formData.get("contextId") as string;
  const dueDate = formData.get("dueDate") as string;
  const type = (formData.get("type") as "TASK" | "HABIT" | "RECURRING") || "TASK";
  const habitType = formData.get("habitType") as "STREAK" | "LEARNING" | "WELLNESS" | "MAINTENANCE";
  const frequency = formData.get("frequency") ? parseInt(formData.get("frequency") as string) : null;
  const tagsString = formData.get("tags") as string;
  
  if (!title || !contextId) {
    throw new Error("Title and context are required");
  }
  
  // Verify context belongs to user
  const context = await prisma.context.findFirst({
    where: { id: contextId, userId }
  });
  
  if (!context) {
    throw new Error("Context not found");
  }
  
  const tags = parseTags(tagsString || "");
  
  // Create task without urgency - it will be calculated dynamically
  await prisma.task.create({
    data: {
      title,
      project: project || null,
      priority,
      tags,
      contextId,
      dueDate: dueDate ? new Date(dueDate) : null,
      type,
      habitType: type === "HABIT" ? habitType : null,
      frequency: type === "HABIT" ? frequency : null,
      userId
    }
  });
  
  revalidatePath("/");
}

// Server action to update an existing task
export async function updateTaskAction(formData: FormData) {
  const userId = await getAuthenticatedUser();
  
  const taskId = formData.get("taskId") as string;
  const title = formData.get("title") as string;
  const project = formData.get("project") as string;
  const priority = (formData.get("priority") as "LOW" | "MEDIUM" | "HIGH") || "MEDIUM";
  const contextId = formData.get("contextId") as string;
  const dueDate = formData.get("dueDate") as string;
  const type = (formData.get("type") as "TASK" | "HABIT" | "RECURRING") || "TASK";
  const habitType = formData.get("habitType") as "STREAK" | "LEARNING" | "WELLNESS" | "MAINTENANCE";
  const frequency = formData.get("frequency") ? parseInt(formData.get("frequency") as string) : null;
  const tagsString = formData.get("tags") as string;
  
  if (!taskId || !title || !contextId) {
    throw new Error("Task ID, title and context are required");
  }
  
  // Verify task belongs to user
  const existingTask = await prisma.task.findFirst({
    where: { id: taskId, userId }
  });
  
  if (!existingTask) {
    throw new Error("Task not found");
  }
  
  // Verify context belongs to user
  const context = await prisma.context.findFirst({
    where: { id: contextId, userId }
  });
  
  if (!context) {
    throw new Error("Context not found");
  }
  
  const tags = parseTags(tagsString || "");
  
  // Calculate urgency
  const urgency = calculateUrgency({
    priority,
    dueDate: dueDate ? new Date(dueDate) : null,
    createdAt: existingTask.createdAt,
    tags
  });
  
  await prisma.task.update({
    where: { id: taskId },
    data: {
      title,
      project: project || null,
      priority,
      tags,
      contextId,
      dueDate: dueDate ? new Date(dueDate) : null,
      urgency,
      type,
      habitType: type === "HABIT" ? habitType : null,
      frequency: type === "HABIT" ? frequency : null,
    }
  });
  
  revalidatePath("/");
}

// Server action to create a new context
export async function createContextAction(formData: FormData) {
  const userId = await getAuthenticatedUser();
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const icon = (formData.get("icon") as string) || "Home";
  const color = (formData.get("color") as string) || "bg-gray-500";
  
  if (!name) {
    throw new Error("Name is required");
  }
  
  await prisma.context.create({
    data: {
      name,
      description: description || null,
      icon,
      color,
      userId
    }
  });
  
  revalidatePath("/");
}

// Server action to delete a task
export async function deleteTaskAction(taskId: string) {
  const userId = await getAuthenticatedUser();
  
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId }
  });
  
  if (!task) {
    throw new Error("Task not found");
  }
  
  await prisma.task.delete({
    where: { id: taskId }
  });
  
  revalidatePath("/");
}

// Sign out action
export async function signOutAction() {
  redirect("/api/auth/signout");
}

// Get all existing tags for autocomplete
export async function getExistingTags(): Promise<string[]> {
  const session = await getServerSession(authOptions) as Session | null;
  
  if (!session?.user?.id) {
    return [];
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      select: { tags: true }
    });

    const allTags = new Set<string>();
    tasks.forEach(task => {
      task.tags.forEach(tag => allTags.add(tag));
    });

    return Array.from(allTags).sort();
  } catch (error) {
    console.error("Error fetching existing tags:", error);
    return [];
  }
}