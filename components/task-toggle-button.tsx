"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";
import { useTransition } from "react";
import { useDashboardActions } from "@/lib/hooks/use-dashboard-actions";

interface TaskToggleButtonProps {
  taskId: string;
  completed: boolean;
}

export function TaskToggleButton({ taskId, completed }: TaskToggleButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { toggleTask } = useDashboardActions();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTask(taskId);
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      className="mt-0.5 p-0 h-auto hover:bg-transparent"
    >
      {completed ? (
        <CheckCircle2 className="w-5 h-5 text-green-600" />
      ) : (
        <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
      )}
    </Button>
  );
}