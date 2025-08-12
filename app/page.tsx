import { CheckCircle2, LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTasks, getContexts } from "@/lib/data";
import { signOutAction } from "@/lib/server-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AutoRefresher } from "@/components/auto-refresher";
import { DashboardClient } from "@/components/dashboard-client";

export default async function Dashboard() {
  // Check authentication
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) {
    redirect("/auth/signin");
  }

  // Server-side data fetching
  const [tasks, contexts] = await Promise.all([getTasks(), getContexts()]);

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
                todone
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

      <DashboardClient tasks={tasks} contexts={contexts} />

      {/* Periodic auto-refresh for multi-device sync */}
      <AutoRefresher intervalMs={5000} />
    </div>
  );
}
