"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import { calculateUrgency, parseTags } from "./utils";

// Get authenticated user or redirect
async function getAuthenticatedUser() {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  return session.user.id;
}

// Server action to toggle task completion
export async function toggleTaskAction(taskId: string) {
  const userId = await getAuthenticatedUser();

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const now = new Date();

  // Handle different task types
  if (task.type === "HABIT" && !task.completed) {
    // Habit is being completed
    const endOfDay = (d: Date) => {
      const x = new Date(d);
      x.setHours(23, 59, 59, 999);
      return x;
    };

    const startOfDay = (d: Date) => {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      return x;
    };

    const addDays = (d: Date, days: number) => {
      const x = new Date(d);
      x.setDate(x.getDate() + days);
      return x;
    };

    const isOnTime = (() => {
      if (task.dueDate) {
        return now <= endOfDay(new Date(task.dueDate));
      }
      if (task.frequency) {
        if (task.lastCompleted) {
          const expectedDue = addDays(startOfDay(new Date(task.lastCompleted)), task.frequency);
          return now <= endOfDay(expectedDue);
        }
        // First completion without a prior window counts as on-time
        return true;
      }
      // No due date and no frequency; treat as on-time
      return true;
    })();

    const nextStreak = isOnTime ? (task.streak || 0) + 1 : 1;
    const nextLongest = Math.max(task.longestStreak || 0, nextStreak);

    // Create habit completion record
    await prisma.habitCompletion.create({
      data: {
        taskId: taskId,
        completedAt: now,
      },
    });

    await prisma.task.update({
      where: { id: taskId },
      data: {
        completed: true,
        completedAt: now,
        lastCompleted: now,
        streak: nextStreak,
        longestStreak: nextLongest,
      },
    });
  } else if (task.type === "HABIT" && task.completed) {
    // Habit is being uncompleted
    await prisma.task.update({
      where: { id: taskId },
      data: {
        completed: false,
        completedAt: null,
        streak: Math.max((task.streak || 1) - 1, 0),
      },
    });
  } else if (task.type === "RECURRING" && !task.completed) {
    // Recurring task is being completed - create next instance
    if (task.frequency) {
      let nextDueDate: Date;
      
      if (task.dueDate) {
        // If task has a due date, calculate next due date from the original due date
        nextDueDate = new Date(task.dueDate);
        nextDueDate.setDate(nextDueDate.getDate() + task.frequency);
      } else {
        // If task has no due date, calculate next due date from completion date
        nextDueDate = new Date(now);
        nextDueDate.setDate(nextDueDate.getDate() + task.frequency);
      }

      // Create the next recurring task instance
      await prisma.task.create({
        data: {
          title: task.title,
          project: task.project,
          priority: task.priority,
          tags: task.tags,
          contextId: task.contextId,
          dueDate: nextDueDate,
          type: "RECURRING",
          frequency: task.frequency,
          nextDue: nextDueDate,
          userId: task.userId,
          completed: false,
        },
      });
    }

    // Mark current task as completed
    await prisma.task.update({
      where: { id: taskId },
      data: {
        completed: true,
        completedAt: now,
      },
    });
  } else {
    // Regular task or uncompleting a recurring task
    await prisma.task.update({
      where: { id: taskId },
      data: {
        completed: !task.completed,
        completedAt: !task.completed ? now : null,
      },
    });
  }

  revalidatePath("/");
}

// Server action to create a new task
export async function createTaskAction(formData: FormData) {
  const userId = await getAuthenticatedUser();

  const title = formData.get("title") as string;
  const project = formData.get("project") as string;
  const priority =
    (formData.get("priority") as "LOW" | "MEDIUM" | "HIGH") || "MEDIUM";
  const contextId = formData.get("contextId") as string;
  const dueDate = formData.get("dueDate") as string;
  const type =
    (formData.get("type") as "TASK" | "HABIT" | "RECURRING") || "TASK";
  const habitType = formData.get("habitType") as
    | "STREAK"
    | "LEARNING"
    | "WELLNESS"
    | "MAINTENANCE";
  const frequency = formData.get("frequency")
    ? parseInt(formData.get("frequency") as string)
    : null;
  const tagsString = formData.get("tags") as string;

  if (!title || !contextId) {
    throw new Error("Title and context are required");
  }

  // Verify context belongs to user
  const context = await prisma.context.findFirst({
    where: { id: contextId, userId },
  });

  if (!context) {
    throw new Error("Context not found");
  }

  const tags = parseTags(tagsString || "");

  // Prepare task data based on type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const taskData: any = {
    title,
    project: project || null,
    priority,
    tags,
    contextId,
    dueDate: dueDate ? new Date(dueDate) : null,
    type,
    userId,
  };

  // Set type-specific fields
  if (type === "HABIT") {
    taskData.habitType = habitType;
    taskData.frequency = frequency;
  } else if (type === "RECURRING") {
    taskData.frequency = frequency;
    if (dueDate) {
      taskData.nextDue = new Date(dueDate);
    }
  }

  await prisma.task.create({
    data: taskData,
  });

  revalidatePath("/");
}

// Server action to update an existing task
export async function updateTaskAction(formData: FormData) {
  const userId = await getAuthenticatedUser();

  const taskId = formData.get("taskId") as string;
  const title = formData.get("title") as string;
  const project = formData.get("project") as string;
  const priority =
    (formData.get("priority") as "LOW" | "MEDIUM" | "HIGH") || "MEDIUM";
  const contextId = formData.get("contextId") as string;
  const dueDate = formData.get("dueDate") as string;
  const type =
    (formData.get("type") as "TASK" | "HABIT" | "RECURRING") || "TASK";
  const habitType = formData.get("habitType") as
    | "STREAK"
    | "LEARNING"
    | "WELLNESS"
    | "MAINTENANCE";
  const frequency = formData.get("frequency")
    ? parseInt(formData.get("frequency") as string)
    : null;
  const tagsString = formData.get("tags") as string;

  if (!taskId || !title || !contextId) {
    throw new Error("Task ID, title and context are required");
  }

  // Verify task belongs to user
  const existingTask = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!existingTask) {
    throw new Error("Task not found");
  }

  // Verify context belongs to user
  const context = await prisma.context.findFirst({
    where: { id: contextId, userId },
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
    tags,
  });

  // Prepare update data based on type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {
    title,
    project: project || null,
    priority,
    tags,
    contextId,
    dueDate: dueDate ? new Date(dueDate) : null,
    urgency,
    type,
    // Clear type-specific fields first
    habitType: null,
    frequency: null,
    nextDue: null,
  };

  // Set type-specific fields
  if (type === "HABIT") {
    updateData.habitType = habitType;
    updateData.frequency = frequency;
  } else if (type === "RECURRING") {
    updateData.frequency = frequency;
    if (dueDate) {
      updateData.nextDue = new Date(dueDate);
    }
  }

  await prisma.task.update({
    where: { id: taskId },
    data: updateData,
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
      userId,
    },
  });

  revalidatePath("/");
}

// Server action to update an existing context
export async function updateContextAction(formData: FormData) {
  const userId = await getAuthenticatedUser();

  const contextId = formData.get("contextId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const icon = (formData.get("icon") as string) || "Home";
  const color = (formData.get("color") as string) || "bg-gray-500";

  if (!contextId || !name) {
    throw new Error("Context ID and name are required");
  }

  // Verify context belongs to user
  const existingContext = await prisma.context.findFirst({
    where: { id: contextId, userId },
  });

  if (!existingContext) {
    throw new Error("Context not found");
  }

  await prisma.context.update({
    where: { id: contextId },
    data: {
      name,
      description: description || null,
      icon,
      color,
    },
  });

  revalidatePath("/");
}

// Server action to delete a task
export async function deleteTaskAction(taskId: string) {
  const userId = await getAuthenticatedUser();

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  revalidatePath("/");
}

// Sign out action
export async function signOutAction() {
  redirect("/api/auth/signout");
}

// Get all existing tags for autocomplete
export async function getExistingTags(): Promise<string[]> {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session?.user?.id) {
    return [];
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      select: { tags: true },
    });

    const allTags = new Set<string>();
    tasks.forEach((task: { tags: string[] }) => {
      task.tags.forEach(tag => allTags.add(tag));
    });

    return Array.from(allTags).sort();
  } catch (error) {
    console.error("Error fetching existing tags:", error);
    return [];
  }
}
