import { CheckCircle2, Settings, LogOut, User, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TaskCard } from "@/components/task-card";
import { getCompletedTasks, getContexts } from "@/lib/data";
import { signOutAction } from "@/lib/server-actions";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/pagination";
import Link from "next/link";

interface CompletedPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function CompletedPage({ searchParams }: CompletedPageProps) {
  // Check authentication
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) {
    redirect("/auth/signin");
  }

  // Parse page parameter
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1;
  const pageSize = 20;

  // Server-side data fetching
  const [completedResult, contexts] = await Promise.all([
    getCompletedTasks(page, pageSize),
    getContexts(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Todone</h1>
              </Link>
              <span className="text-gray-400">/</span>
              <h2 className="text-xl font-semibold text-gray-700">Completed Tasks</h2>
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Completed Tasks</h1>
                <p className="text-sm text-gray-600">
                  {completedResult.totalCount} tasks completed, ordered by completion date
                </p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Completed Tasks List */}
        {completedResult.data.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="divide-y divide-gray-200">
              {completedResult.data.map((task) => {
                const completedDate = task.completedAt ? new Date(task.completedAt) : null;
                return (
                  <div key={task.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <TaskCard task={task} contexts={contexts} />
                      {completedDate && (
                        <div className="ml-4 text-right">
                          <div className="text-xs text-gray-500">Completed</div>
                          <div className="text-sm font-medium text-gray-700">
                            {completedDate.toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {completedDate.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={completedResult.currentPage}
              totalPages={completedResult.totalPages}
              hasNextPage={completedResult.hasNextPage}
              hasPreviousPage={completedResult.hasPreviousPage}
              totalCount={completedResult.totalCount}
              pageSize={pageSize}
            />
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-sm p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No completed tasks yet
              </h3>
              <p className="text-gray-600 mb-6">
                Tasks you complete will appear here, ordered by when you finished them.
              </p>
              <Link href="/">
                <Button>
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}