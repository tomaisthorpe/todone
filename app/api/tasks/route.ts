import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateUrgency } from "@/lib/utils";
import { Session } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      project,
      priority = "MEDIUM",
      tags = [],
      contextId,
      dueDate,
      type = "TASK",
      habitType,
      frequency,
      nextDue
    } = body;

    // Validate required fields
    if (!title || !contextId) {
      return NextResponse.json(
        { error: "Title and context are required" },
        { status: 400 }
      );
    }

    // Verify context belongs to user
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

    // Calculate urgency
    const urgency = calculateUrgency({
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      createdAt: new Date(),
      tags
    });

    const task = await prisma.task.create({
      data: {
        title,
        project,
        priority,
        tags,
        contextId,
        dueDate: dueDate ? new Date(dueDate) : null,
        urgency,
        type,
        habitType: type === "HABIT" ? habitType : null,
        frequency: type === "HABIT" ? frequency : null,
        nextDue: type === "RECURRING" ? (nextDue ? new Date(nextDue) : null) : null,
        userId: session.user.id
      },
      include: {
        context: true
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}