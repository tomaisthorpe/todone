import { NextResponse } from "next/server";
import { getTasks } from "@/lib/data";
import { countDueAndOverdueTasks } from "@/lib/badge-utils";

export async function GET() {
  try {
    const tasks = await getTasks();
    const badgeCount = countDueAndOverdueTasks(tasks);
    
    return NextResponse.json({ count: badgeCount });
  } catch (error) {
    console.error('Error getting badge count:', error);
    return NextResponse.json({ error: 'Failed to get badge count' }, { status: 500 });
  }
}