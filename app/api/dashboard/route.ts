import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTasks, getContexts, getArchivedContexts } from "@/lib/data";

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch data in parallel
    const [tasks, contexts, archivedContexts] = await Promise.all([
      getTasks(),
      getContexts(),
      getArchivedContexts(),
    ]);

    return NextResponse.json({
      tasks,
      contexts,
      archivedContexts,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}