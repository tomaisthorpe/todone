"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { CheckCircle2, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TodaySection } from "@/components/today-section";
import { ContextGroup } from "@/components/context-group";
import { useTasks, useToggleTask } from "@/hooks/use-tasks";
import { useContexts } from "@/hooks/use-contexts";

export default function Dashboard() {
  const { status } = useSession();
  const [collapsedContexts, setCollapsedContexts] = useState(new Set<string>());

  // Redirect to auth if not authenticated
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: tasks = [], isLoading: tasksLoading, error: tasksError } = useTasks();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: contexts = [], isLoading: contextsLoading, error: contextsError } = useContexts();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const toggleTaskMutation = useToggleTask();

  const handleToggleContext = (contextId: string) => {
    const newCollapsed = new Set(collapsedContexts);
    if (newCollapsed.has(contextId)) {
      newCollapsed.delete(contextId);
    } else {
      newCollapsed.add(contextId);
    }
    setCollapsedContexts(newCollapsed);
  };

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      await toggleTaskMutation.mutateAsync({
        id: taskId,
        completed: !task.completed
      });
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  if (tasksLoading || contextsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (tasksError || contextsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading data. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Todone</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Today Section */}
        <TodaySection tasks={tasks} onToggleTask={handleToggleTask} />

        {/* Contexts Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Contexts</h2>
          {contexts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contexts.map((context) => (
                <ContextGroup
                  key={context.id}
                  context={context}
                  tasks={tasks}
                  isCollapsed={collapsedContexts.has(context.id)}
                  onToggleCollapse={handleToggleContext}
                  onToggleTask={handleToggleTask}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No contexts yet. Create one to get started!</p>
              <Button className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Context
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
