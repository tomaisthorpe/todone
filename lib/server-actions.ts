"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import { calculateUrgency, parseTags } from "./utils";
import { processHabitCompletion, processHabitUncompletion } from "./habit-utils";
import { addDays } from "./date-utils";

// Get authenticated user or redirect
async function getAuthenticatedUser() {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  return session.user.id;
}

// Helper function to create an inbox context for a user
export async function createInboxContext(userId: string) {
  try {
    const inboxContext = await prisma.context.create({
      data: {
        name: "Inbox",
        description: "Default context for new tasks",
        icon: "Inbox",
        color: "bg-blue-500",
        coefficient: 0.0,
        isInbox: true,
        userId,
      },
    });
    return inboxContext;
  } catch (error) {
    console.error("Error creating inbox context:", error);
    throw error;
  }
}

// Helper function to get or create user's inbox context
export async function getOrCreateInboxContext(userId: string) {
  // First try to find existing inbox
  let inboxContext = await prisma.context.findFirst({
    where: { userId, isInbox: true },
  });

  // If no inbox exists, create one
  if (!inboxContext) {
    inboxContext = await createInboxContext(userId);
  }

  return inboxContext;
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
    await processHabitCompletion(taskId, {
      id: task.id,
      dueDate: task.dueDate,
      frequency: task.frequency,
      completedAt: task.completedAt,
      streak: task.streak,
      longestStreak: task.longestStreak,
    }, now);
  } else if (task.type === "HABIT" && task.completed) {
    // Habit is being uncompleted
    await processHabitUncompletion(taskId, {
      id: task.id,
      dueDate: task.dueDate,
      frequency: task.frequency,
      completedAt: task.completedAt,
      streak: task.streak,
      longestStreak: task.longestStreak,
    });
  } else if (task.type === "RECURRING" && !task.completed) {
    // Recurring task is being completed - create next instance
    if (task.frequency) {
      let nextDueDate: Date;

      if (task.dueDate) {
        // If task has a due date, calculate next due date from the original due date
        nextDueDate = addDays(new Date(task.dueDate), task.frequency);
      } else {
        // If task has no due date, calculate next due date from completion date
        nextDueDate = addDays(new Date(now), task.frequency);
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
          type: task.type,
          userId: task.userId,
          frequency: task.frequency,
          nextDue: nextDueDate,
        },
      });

      // Mark current recurring task as completed
      await prisma.task.update({
        where: { id: taskId },
        data: {
          completed: true,
          completedAt: now,
        },
      });

      revalidatePath("/");
      return;
    }
  }

  // Toggle task completion state (non-habit or non-recurring)
  await prisma.task.update({
    where: { id: taskId },
    data: {
      completed: !task.completed,
      completedAt: !task.completed ? now : null,
    },
  });

  revalidatePath("/");
}

// Server action to mark task as completed yesterday
export async function completeTaskYesterdayAction(taskId: string) {
  const userId = await getAuthenticatedUser();

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  // Calculate yesterday's date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  // Set to end of yesterday for completion time
  yesterday.setHours(23, 59, 59, 999);

  // Handle different task types similar to toggleTaskAction
  if (task.type === "HABIT" && !task.completed) {
    // Habit is being completed for yesterday
    await processHabitCompletion(taskId, {
      id: task.id,
      dueDate: task.dueDate,
      frequency: task.frequency,
      completedAt: task.completedAt,
      streak: task.streak,
      longestStreak: task.longestStreak,
    }, yesterday);
  } else if (task.type === "RECURRING" && !task.completed) {
    // Recurring task is being completed yesterday - create next instance
    if (task.frequency) {
      let nextDueDate: Date;

      if (task.dueDate) {
        // If task has a due date, calculate next due date from the original due date
        nextDueDate = addDays(new Date(task.dueDate), task.frequency);
      } else {
        // If task has no due date, calculate next due date from yesterday's completion date
        nextDueDate = addDays(new Date(yesterday), task.frequency);
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
          type: task.type,
          userId: task.userId,
          frequency: task.frequency,
          nextDue: nextDueDate,
        },
      });

      // Mark current recurring task as completed yesterday
      await prisma.task.update({
        where: { id: taskId },
        data: {
          completed: true,
          completedAt: yesterday,
        },
      });

      revalidatePath("/");
      return;
    }
  }

  // Mark regular task as completed yesterday
  if (!task.completed) {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        completed: true,
        completedAt: yesterday,
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

  if (!title) {
    throw new Error("Title is required");
  }

  // Use provided context or fallback to inbox
  let finalContextId = contextId;
  if (!contextId) {
    const inboxContext = await getOrCreateInboxContext(userId);
    finalContextId = inboxContext.id;
  }

  // Verify context belongs to user
  const context = await prisma.context.findFirst({
    where: { id: finalContextId, userId },
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
    contextId: finalContextId,
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
    project: project || null,
    contextCoefficient: context.coefficient || 0,
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
  const coefficient = parseFloat(formData.get("coefficient") as string) || 0.0;

  if (!name) {
    throw new Error("Name is required");
  }

  // Create context
  await prisma.context.create({
    data: {
      name,
      description: description || null,
      icon,
      color,
      coefficient,
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
  const coefficient = parseFloat(formData.get("coefficient") as string) || 0.0;

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

  // Prevent modifying inbox contexts
  if (existingContext.isInbox) {
    throw new Error("Inbox context cannot be modified");
  }

  await prisma.context.update({
    where: { id: contextId },
    data: {
      name,
      description: description || null,
      icon,
      color,
      coefficient,
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
      task.tags.forEach((tag) => allTags.add(tag));
    });

    return Array.from(allTags).sort();
  } catch (error) {
    console.error("Error fetching existing tags:", error);
    return [];
  }
}

// Archive context action
export async function archiveContextAction(contextId: string) {
  const userId = await getAuthenticatedUser();

  // Verify context belongs to user
  const existingContext = await prisma.context.findFirst({
    where: { id: contextId, userId },
  });

  if (!existingContext) {
    throw new Error("Context not found");
  }

  // Prevent archiving inbox contexts
  if (existingContext.isInbox) {
    throw new Error("Inbox context cannot be archived");
  }

  // Handle tasks in the context before archiving
  const tasks = await prisma.task.findMany({
    where: { contextId },
  });

  // Delete incomplete tasks, keep completed tasks
  const incompleteTasks = tasks.filter((task) => !task.completed);
  if (incompleteTasks.length > 0) {
    await prisma.task.deleteMany({
      where: {
        id: { in: incompleteTasks.map((task) => task.id) },
      },
    });
  }

  // Archive the context
  await prisma.context.update({
    where: { id: contextId },
    data: { archived: true },
  });

  revalidatePath("/");
}

// Unarchive context action
export async function unarchiveContextAction(contextId: string) {
  const userId = await getAuthenticatedUser();

  // Verify context belongs to user
  const existingContext = await prisma.context.findFirst({
    where: { id: contextId, userId, archived: true },
  });

  if (!existingContext) {
    throw new Error("Archived context not found");
  }

  // Unarchive the context
  await prisma.context.update({
    where: { id: contextId },
    data: { archived: false },
  });

  revalidatePath("/");
}
