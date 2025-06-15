import { CheckCircle2, Plus, Settings, LogOut, User } from "lucide-react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TodaySection } from "@/components/today-section";
import { ContextGroup } from "@/components/context-group";
import { getTasks, getContexts } from "@/lib/data";
import { signOutAction } from "@/lib/server-actions";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  // Check authentication
  const session = await getServerSession(authOptions) as Session | null;
  
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
              <h1 className="text-2xl font-bold text-gray-900">Todone</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{session.user?.name || session.user?.email}</span>
              </div>
              <form action={signOutAction}>
                <Button type="submit" variant="ghost" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </Button>
              </form>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Today Section */}
        <TodaySection tasks={tasks} />

        {/* Context Groups */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Contexts</h2>
          {contexts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {contexts.map((context) => (
                <ContextGroup
                  key={context.id}
                  context={context}
                  tasks={tasks}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No contexts yet. Create one to get started!
              </p>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4">
                <Plus className="w-4 h-4" />
                <span>Add Context</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
