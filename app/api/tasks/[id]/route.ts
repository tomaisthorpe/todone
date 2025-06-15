import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateUrgency } from "@/lib/utils";
import { Session } from "next-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const task = await prisma.task.findFirst({
      where: {
        id: id,
        userId: session.user.id
      },
      include: {
        context: true,
        habitCompletions: true
      }
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      project,
      priority,
      tags,
      contextId,
      dueDate,
      completed,
      habitType,
      frequency,
      nextDue
    } = body;

    // Find existing task
    const existingTask = await prisma.task.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // If contextId is being changed, verify new context belongs to user
    if (contextId && contextId !== existingTask.contextId) {
      const context = await prisma.context.findFirst({
        where: {
          id: contextId,
          userId: session.user.id
        }
      });

      if (!context) {
        return NextResponse.json(
          { error: "Context not found" },
          { status: 404 }
        );
      }
    }

    // Handle habit completion
    let habitCompletionData = {};
    if (existingTask.type === "HABIT" && completed && !existingTask.completed) {
      // Habit is being completed
      habitCompletionData = {
        lastCompleted: new Date(),
        streak: (existingTask.streak || 0) + 1,
        longestStreak: Math.max((existingTask.longestStreak || 0), (existingTask.streak || 0) + 1)
      };

      // Create habit completion record
      await prisma.habitCompletion.create({
        data: {
          taskId: id,
          completedAt: new Date()
        }
      });
    } else if (existingTask.type === "HABIT" && !completed && existingTask.completed) {
      // Habit is being uncompleted - we'll keep the completion history but reset streak
      habitCompletionData = {
        streak: Math.max((existingTask.streak || 1) - 1, 0)
      };
    }

    // Calculate new urgency
    const urgency = calculateUrgency({
      priority: priority || existingTask.priority,
      dueDate: dueDate ? new Date(dueDate) : existingTask.dueDate,
      createdAt: existingTask.createdAt,
      tags: tags || existingTask.tags
    });

    const updatedTask = await prisma.task.update({
      where: {
        id: id
      },
      data: {
        ...(title !== undefined && { title }),
        ...(project !== undefined && { project }),
        ...(priority !== undefined && { priority }),
        ...(tags !== undefined && { tags }),
        ...(contextId !== undefined && { contextId }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(completed !== undefined && { completed }),
        ...(habitType !== undefined && { habitType }),
        ...(frequency !== undefined && { frequency }),
        ...(nextDue !== undefined && { nextDue: nextDue ? new Date(nextDue) : null }),
        urgency,
        ...habitCompletionData
      },
      include: {
        context: true,
        habitCompletions: true
      }
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify task belongs to user
    const task = await prisma.task.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Delete task (habit completions will be cascade deleted)
    await prisma.task.delete({
      where: {
        id: id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}