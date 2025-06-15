"use client";

import { useState, useTransition, useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTaskAction, createContextAction } from "@/lib/server-actions";
import {
  CheckSquare,
  RotateCcw,
  Dumbbell,
  BookOpen,
  Heart,
  Wrench,
  Home,
  Code,
  Coffee,
  Building,
} from "lucide-react";

// Form schemas
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  project: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  contextId: z.string().min(1, "Context is required"),
  dueDate: z.string().optional(),
  type: z.enum(["TASK", "HABIT", "RECURRING"]),
  habitType: z
    .enum(["STREAK", "LEARNING", "WELLNESS", "MAINTENANCE"])
    .optional(),
  frequency: z.number().min(1).max(365).optional(),
  tags: z.string().optional(),
});

const contextSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  icon: z.string(),
  color: z.string(),
});

type TaskFormData = z.infer<typeof taskSchema>;
type ContextFormData = z.infer<typeof contextSchema>;

interface AddItemModalProps {
  contexts: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
  children: React.ReactNode;
  defaultContextId?: string;
}

const contextIcons = [
  { value: "Home", icon: Home, label: "Home" },
  { value: "Code", icon: Code, label: "Coding" },
  { value: "Coffee", icon: Coffee, label: "Kitchen" },
  { value: "Building", icon: Building, label: "Work" },
];

const contextColors = [
  { value: "bg-blue-500", label: "Blue", color: "bg-blue-500" },
  { value: "bg-green-500", label: "Green", color: "bg-green-500" },
  { value: "bg-purple-500", label: "Purple", color: "bg-purple-500" },
  { value: "bg-red-500", label: "Red", color: "bg-red-500" },
  { value: "bg-yellow-500", label: "Yellow", color: "bg-yellow-500" },
  { value: "bg-cyan-500", label: "Cyan", color: "bg-cyan-500" },
  { value: "bg-pink-500", label: "Pink", color: "bg-pink-500" },
  { value: "bg-gray-500", label: "Gray", color: "bg-gray-500" },
];

const habitTypeIcons = {
  STREAK: { icon: Dumbbell, color: "text-red-500" },
  LEARNING: { icon: BookOpen, color: "text-blue-500" },
  WELLNESS: { icon: Heart, color: "text-green-500" },
  MAINTENANCE: { icon: Wrench, color: "text-gray-500" },
};

export function AddItemModal({ contexts, children, defaultContextId }: AddItemModalProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"task" | "context">("task");
  const [isPending, startTransition] = useTransition();
  
  // Generate unique IDs for this modal instance to prevent conflicts
  const modalId = useId();
  const getFieldId = (fieldName: string) => `${modalId}-${fieldName}`;

  const taskForm = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: "MEDIUM",
      type: "TASK",
      tags: "",
      contextId: defaultContextId || "",
    },
  });

  const contextForm = useForm<ContextFormData>({
    resolver: zodResolver(contextSchema),
    defaultValues: {
      icon: "Home",
      color: "bg-blue-500",
    },
  });

  // Reset task form with default context when modal opens
  useEffect(() => {
    if (open && defaultContextId) {
      taskForm.setValue("contextId", defaultContextId);
    }
  }, [open, defaultContextId, taskForm]);

  const taskType = taskForm.watch("type");

  const onSubmitTask = (data: TaskFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.project) formData.append("project", data.project);
      formData.append("priority", data.priority);
      formData.append("contextId", data.contextId);
      if (data.dueDate) formData.append("dueDate", data.dueDate);
      formData.append("type", data.type);
      if (data.habitType) formData.append("habitType", data.habitType);
      if (data.frequency)
        formData.append("frequency", data.frequency.toString());

      await createTaskAction(formData);
      taskForm.reset();
      setOpen(false);
    });
  };

  const onSubmitContext = (data: ContextFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      formData.append("icon", data.icon);
      formData.append("color", data.color);

      await createContextAction(formData);
      contextForm.reset();
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-xl rounded-2xl border-0">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1 mt-2 mb-6">
          <button
            onClick={() => setActiveTab("task")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
              ${
                activeTab === "task"
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "bg-transparent text-gray-500 hover:text-gray-700"
              }
            `}
            type="button"
          >
            <CheckSquare className="w-4 h-4 inline mr-2" />
            Add Task
          </button>
          <button
            onClick={() => setActiveTab("context")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
              ${
                activeTab === "context"
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "bg-transparent text-gray-500 hover:text-gray-700"
              }
            `}
            type="button"
          >
            <Home className="w-4 h-4 inline mr-2" />
            Add Context
          </button>
        </div>

        {/* Task Form */}
        {activeTab === "task" && (
          <form
            onSubmit={taskForm.handleSubmit(onSubmitTask)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor={getFieldId("title")}>Task Title *</Label>
                <Input
                  id={getFieldId("title")}
                  placeholder="What needs to be done?"
                  {...taskForm.register("title")}
                />
                {taskForm.formState.errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {taskForm.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={getFieldId("type")}>Task Type</Label>
                <Select
                  value={taskForm.watch("type")}
                  onValueChange={(value) =>
                    taskForm.setValue(
                      "type",
                      value as "TASK" | "HABIT" | "RECURRING"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TASK">
                      <CheckSquare className="w-4 h-4 inline mr-2" />
                      Regular Task
                    </SelectItem>
                    <SelectItem value="HABIT">
                      <Dumbbell className="w-4 h-4 inline mr-2" />
                      Habit
                    </SelectItem>
                    <SelectItem value="RECURRING">
                      <RotateCcw className="w-4 h-4 inline mr-2" />
                      Recurring Task
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={getFieldId("priority")}>Priority</Label>
                <Select
                  value={taskForm.watch("priority")}
                  onValueChange={(value) =>
                    taskForm.setValue(
                      "priority",
                      value as "LOW" | "MEDIUM" | "HIGH"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={getFieldId("context")}>Context *</Label>
                <Select
                  value={taskForm.watch("contextId")}
                  onValueChange={(value) =>
                    taskForm.setValue("contextId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select context" />
                  </SelectTrigger>
                  <SelectContent>
                    {contexts.map((context) => {
                      const IconComponent =
                        contextIcons.find((c) => c.value === context.icon)
                          ?.icon || Home;
                      return (
                        <SelectItem key={context.id} value={context.id}>
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full ${context.color} mr-2`}
                            />
                            <IconComponent className="w-4 h-4 mr-2" />
                            {context.name}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {taskForm.formState.errors.contextId && (
                  <p className="text-sm text-red-500 mt-1">
                    {taskForm.formState.errors.contextId.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={getFieldId("dueDate")}>Due Date</Label>
                <Input
                  id={getFieldId("dueDate")}
                  type="datetime-local"
                  {...taskForm.register("dueDate")}
                />
              </div>

              {/* Habit-specific fields */}
              {taskType === "HABIT" && (
                <>
                  <div>
                    <Label htmlFor={getFieldId("habitType")}>Habit Type</Label>
                    <Select
                      value={taskForm.watch("habitType")}
                      onValueChange={(value) =>
                        taskForm.setValue(
                          "habitType",
                          value as
                            | "STREAK"
                            | "LEARNING"
                            | "WELLNESS"
                            | "MAINTENANCE"
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select habit type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(habitTypeIcons).map(
                          ([type, { icon: Icon, color }]) => (
                            <SelectItem key={type} value={type}>
                              <Icon
                                className={`w-4 h-4 inline mr-2 ${color}`}
                              />
                              {type.charAt(0) + type.slice(1).toLowerCase()}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={getFieldId("frequency")}>Frequency (days)</Label>
                    <Input
                      id={getFieldId("frequency")}
                      type="number"
                      min="1"
                      max="365"
                      placeholder="1 = daily, 7 = weekly"
                      {...taskForm.register("frequency", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </>
              )}

              <div className="col-span-2">
                <Label htmlFor={getFieldId("project")}>Project</Label>
                <Input
                  id={getFieldId("project")}
                  placeholder="Optional project name"
                  {...taskForm.register("project")}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor={getFieldId("tags")}>Tags</Label>
                <Input
                  id={getFieldId("tags")}
                  placeholder="Comma-separated tags (coming soon)"
                  disabled
                  {...taskForm.register("tags")}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        )}

        {/* Context Form */}
        {activeTab === "context" && (
          <form
            onSubmit={contextForm.handleSubmit(onSubmitContext)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor={getFieldId("name")}>Context Name *</Label>
                <Input
                  id={getFieldId("name")}
                  placeholder="e.g., Work, Home, Kitchen"
                  {...contextForm.register("name")}
                />
                {contextForm.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {contextForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={getFieldId("icon")}>Icon</Label>
                <Select
                  value={contextForm.watch("icon")}
                  onValueChange={(value) => contextForm.setValue("icon", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contextIcons.map(({ value, icon: Icon, label }) => (
                      <SelectItem key={value} value={value}>
                        <Icon className="w-4 h-4 inline mr-2" />
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={getFieldId("color")}>Color</Label>
                <Select
                  value={contextForm.watch("color")}
                  onValueChange={(value) =>
                    contextForm.setValue("color", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contextColors.map(({ value, label, color }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded-full ${color} mr-2`}
                          />
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor={getFieldId("description")}>Description</Label>
                <Textarea
                  id={getFieldId("description")}
                  placeholder="Optional description"
                  {...contextForm.register("description")}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Context"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
