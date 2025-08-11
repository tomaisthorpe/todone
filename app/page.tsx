import { CheckCircle2, LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TodaySection } from "@/components/today-section";
import { AddItemModal } from "@/components/add-item-modal";
import { SmartTaskInput } from "@/components/smart-task-input";
import { getTasks, getContexts } from "@/lib/data";
import { signOutAction } from "@/lib/server-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ContextsSection } from "@/components/contexts-section";
import { AutoRefresher } from "@/components/auto-refresher";

export default async function Dashboard() {
  // Check authentication
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) {
    redirect("/auth/signin");
  }

  // Server-side data fetching
  const [tasks, contexts] = await Promise.all([getTasks(), getContexts()]);

  // Sort contexts by health (lowest first), then by highest urgency task
  // This sorting is stable and only calculated on server-side load/reload
  const sortedContexts = [...contexts].sort((a, b) => {
    // Calculate health for each context (server-side snapshot)
    const aHabits = tasks.filter(
      (task) => task.contextId === a.id && task.type === "HABIT"
    );
    const bHabits = tasks.filter(
      (task) => task.contextId === b.id && task.type === "HABIT"
    );

    const aHealth =
      aHabits.length === 0
        ? 100
        : Math.round(
            (aHabits.filter((h) => h.completed).length / aHabits.length) * 100
          );
    const bHealth =
      bHabits.length === 0
        ? 100
        : Math.round(
            (bHabits.filter((h) => h.completed).length / bHabits.length) * 100
          );

    // Sort by health (lowest first)
    if (aHealth !== bHealth) {
      return aHealth - bHealth;
    }

    // If health is equal, sort by highest urgency task in context
    const aMaxUrgency = Math.max(
      ...tasks
        .filter((task) => task.contextId === a.id)
        .map((task) => task.urgency),
      0
    );
    const bMaxUrgency = Math.max(
      ...tasks
        .filter((task) => task.contextId === b.id)
        .map((task) => task.urgency),
      0
    );

    return bMaxUrgency - aMaxUrgency;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="hidden md:block text-2xl font-bold text-gray-900">
                Todone
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/completed">
                <Button variant="ghost" size="sm">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Completed
                </Button>
              </Link>
              <form action={signOutAction}>
                <Button type="submit" variant="ghost" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Smart Task Input */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <SmartTaskInput contexts={contexts} />
        </div>

        {/* Today Section */}
        <TodaySection tasks={tasks} contexts={contexts} />

        {/* Context Groups */}
        <ContextsSection contexts={sortedContexts} tasks={tasks} />
      </div>
      <div className="flex justify-center mt-2 pb-16">
        <AddItemModal contexts={contexts} />
      </div>

      {/* Periodic auto-refresh for multi-device sync */}
      <AutoRefresher intervalMs={5000} />
    </div>
  );
}
