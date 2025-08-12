"use client";

import { TaskCard } from "@/components/task-card";
import { Pagination } from "@/components/pagination";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Task, Context } from "@/lib/data";

interface CompletedClientProps {
  completedResult: {
    data: Task[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  contexts: Context[];
  pageSize: number;
}

export function CompletedClient({ completedResult, contexts, pageSize }: CompletedClientProps) {
  // Simple no-op handler for context clicks since we don't have context groups on this page
  const handleContextClick = () => {
    // Do nothing - context badges are just for display on the completed page
  };

  return (
    <>
      {/* Completed Tasks List */}
      {completedResult.data.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="divide-y divide-gray-200">
            {completedResult.data.map((task) => {
              const completedDate = task.completedAt
                ? new Date(task.completedAt)
                : null;
              return (
                <div key={task.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <TaskCard 
                      task={task} 
                      contexts={contexts} 
                      showContext={true} 
                      onContextClick={handleContextClick}
                    />
                    {completedDate && (
                      <div className="ml-4 text-right">
                        <div className="text-xs text-gray-500">Completed</div>
                        <div className="text-sm font-medium text-gray-700">
                          {completedDate.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {completedDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
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
              Tasks you complete will appear here, ordered by when you
              finished them.
            </p>
            <Link href="/">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}