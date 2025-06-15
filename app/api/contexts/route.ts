import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contexts = await prisma.context.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        tasks: {
          where: {
            userId: session.user.id
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(contexts);
  } catch (error) {
    console.error('Error fetching contexts:', error);
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
      name,
      description,
      icon = "Home",
      color = "bg-gray-500",
      shared = false
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const context = await prisma.context.create({
      data: {
        name,
        description,
        icon,
        color,
        shared,
        userId: session.user.id
      }
    });

    return NextResponse.json(context);
  } catch (error) {
    console.error('Error creating context:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}