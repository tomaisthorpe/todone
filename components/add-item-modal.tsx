"use client";

import { useState, useTransition, useEffect, useId, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { TagsInput } from "@/components/ui/tags-input";
import {
  createTaskAction,
  updateTaskAction,
  createContextAction,
  deleteTaskAction,
  getExistingTags,
} from "@/lib/server-actions";
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
  Plus,
  Pizza,
  UtensilsCrossed,
  ChefHat,
  Wine,
  Beer,
  Grape,
  Salad,
  CookingPot,
  Croissant,
  IceCreamCone,
  Cake,
  Sandwich,
  Soup,
  Wallet,
  Coins,
  PiggyBank,
  CreditCard,
  Banknote,
  TrendingUp,
  Calculator,
  Receipt,
  Leaf,
  TreePine,
  Sprout,
  Flower,
  TreeDeciduous,
  Flower2,
  LeafyGreen,
  Trees,
  FlaskConical,
  TestTube,
  Beaker,
  Calendar,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import type { Task } from "@/lib/data";

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
  tags: z.array(z.string()),
});

const contextSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  icon: z.string(),
  color: z.string(),
});

type TaskFormData = z.infer<typeof taskSchema>;
type ContextFormData = z.infer<typeof contextSchema>;

interface TaskModalProps {
  contexts: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
  defaultContextId?: string;
}

const contextIcons = [
  { value: "Home", icon: Home, label: "Home" },
  { value: "Code", icon: Code, label: "Coding" },
  { value: "Coffee", icon: Coffee, label: "Kitchen" },
  { value: "Building", icon: Building, label: "Work" },
  // Food & Beverage Icons
  { value: "Pizza", icon: Pizza, label: "Food" },
  { value: "UtensilsCrossed", icon: UtensilsCrossed, label: "Dining" },
  { value: "ChefHat", icon: ChefHat, label: "Cooking" },
  { value: "Wine", icon: Wine, label: "Wine" },
  { value: "Beer", icon: Beer, label: "Beer" },
  { value: "Grape", icon: Grape, label: "Fermentation" },
  { value: "Salad", icon: Salad, label: "Healthy Food" },
  { value: "CookingPot", icon: CookingPot, label: "Meal Prep" },
  { value: "Croissant", icon: Croissant, label: "Bakery" },
  { value: "IceCreamCone", icon: IceCreamCone, label: "Desserts" },
  { value: "Cake", icon: Cake, label: "Baking" },
  { value: "Sandwich", icon: Sandwich, label: "Quick Meals" },
  { value: "Soup", icon: Soup, label: "Comfort Food" },
  // Finance Icons
  { value: "Wallet", icon: Wallet, label: "Personal Finance" },
  { value: "Coins", icon: Coins, label: "Savings" },
  { value: "PiggyBank", icon: PiggyBank, label: "Budget" },
  { value: "CreditCard", icon: CreditCard, label: "Credit" },
  { value: "Banknote", icon: Banknote, label: "Cash" },
  { value: "TrendingUp", icon: TrendingUp, label: "Investments" },
  { value: "Calculator", icon: Calculator, label: "Accounting" },
  { value: "Receipt", icon: Receipt, label: "Expenses" },
  // Plant/Nature Icons
  { value: "Leaf", icon: Leaf, label: "Plants" },
  { value: "TreePine", icon: TreePine, label: "Garden" },
  { value: "Sprout", icon: Sprout, label: "Growing" },
  { value: "Flower", icon: Flower, label: "Flowers" },
  { value: "TreeDeciduous", icon: TreeDeciduous, label: "Trees" },
  { value: "Flower2", icon: Flower2, label: "Gardening" },
  { value: "LeafyGreen", icon: LeafyGreen, label: "Herbs" },
  { value: "Trees", icon: Trees, label: "Forest" },
  // Science/Fermentation Icons
  { value: "FlaskConical", icon: FlaskConical, label: "Brewing" },
  { value: "TestTube", icon: TestTube, label: "Experiments" },
  { value: "Beaker", icon: Beaker, label: "Laboratory" },
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
  { value: "bg-orange-500", label: "Orange", color: "bg-orange-500" },
  { value: "bg-emerald-500", label: "Emerald", color: "bg-emerald-500" },
  { value: "bg-teal-500", label: "Teal", color: "bg-teal-500" },
  { value: "bg-indigo-500", label: "Indigo", color: "bg-indigo-500" },
];

const habitTypeIcons = {
  STREAK: { icon: Dumbbell, color: "text-red-500" },
  LEARNING: { icon: BookOpen, color: "text-blue-500" },
  WELLNESS: { icon: Heart, color: "text-green-500" },
  MAINTENANCE: { icon: Wrench, color: "text-gray-500" },
};

export function TaskModal({
  contexts,
  task,
  isOpen,
  onClose,
  defaultContextId,
}: TaskModalProps) {
  const [activeTab, setActiveTab] = useState<"task" | "context">("task");
  const [isPending, startTransition] = useTransition();
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Generate unique IDs for this modal instance to prevent conflicts
  const modalId = useId();
  const getFieldId = (fieldName: string) => `${modalId}-${fieldName}`;

  const isEditing = !!task;

  const taskForm = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: "MEDIUM",
      type: "TASK",
      tags: [],
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

  // Load existing tags for autocomplete
  useEffect(() => {
    if (isOpen) {
      getExistingTags().then(setExistingTags);
    }
  }, [isOpen]);

  // Reset forms when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Editing mode - populate form with task data
        taskForm.reset({
          title: task.title,
          project: task.project || "",
          priority: task.priority,
          contextId: task.contextId,
          dueDate: task.dueDate
            ? new Date(task.dueDate).toISOString().slice(0, 16)
            : "",
          type: task.type,
          habitType: task.habitType || undefined,
          frequency: task.frequency || undefined,
          tags: task.tags,
        });
      } else {
        // Adding mode - reset to defaults
        taskForm.reset({
          priority: "MEDIUM",
          type: "TASK",
          tags: [],
          contextId: defaultContextId || "",
        });
      }

      // Auto-focus title input
      setTimeout(() => {
        titleInputRef.current?.focus();
        titleInputRef.current?.select();
      }, 100);
    }
  }, [isOpen, task, defaultContextId, taskForm]);

  const taskType = taskForm.watch("type");

  const onSubmitTask = (data: TaskFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      if (isEditing) {
        formData.append("taskId", task.id);
      }
      formData.append("title", data.title);
      if (data.project) formData.append("project", data.project);
      formData.append("priority", data.priority);
      formData.append("contextId", data.contextId);
      if (data.dueDate) formData.append("dueDate", data.dueDate);
      formData.append("type", data.type);
      if (data.habitType) formData.append("habitType", data.habitType);
      if (data.frequency)
        formData.append("frequency", data.frequency.toString());

      // Convert tags array to comma-separated string for form data
      formData.append("tags", data.tags.join(", "));

      if (isEditing) {
        await updateTaskAction(formData);
      } else {
        await createTaskAction(formData);
      }

      onClose();
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
      onClose();
    });
  };

  const handleDeleteTask = () => {
    if (!task) return;
    startTransition(async () => {
      await deleteTaskAction(task.id);
      setShowDeleteConfirm(false);
      onClose();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-xl rounded-2xl border-0"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          if (titleInputRef.current) {
            titleInputRef.current.focus();
            titleInputRef.current.select();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Add New Item"}</DialogTitle>
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
            {isEditing ? "Edit Task" : "Add Task"}
          </button>
          {!isEditing && (
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
          )}
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
                  {...taskForm.register("title", {
                    setValueAs: (v) => v,
                  })}
                  ref={(el) => {
                    titleInputRef.current = el;
                    const { ref } = taskForm.register("title");
                    if (typeof ref === "function") ref(el);
                  }}
                />
                {taskForm.formState.errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {taskForm.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Show creation date when editing */}
              {isEditing && task && (
                <div className="col-span-2">
                  <Label>Created On</Label>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(task.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              )}

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
                    <Label htmlFor={getFieldId("frequency")}>
                      Frequency (days)
                    </Label>
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
                <TagsInput
                  value={taskForm.watch("tags")}
                  onChange={(tags) => taskForm.setValue("tags", tags)}
                  suggestions={existingTags}
                  placeholder="Add tags (e.g., urgent, work, fitness)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Type tags and press Enter or comma to add. Start typing to see
                  suggestions from existing tags.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <div>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isPending}
                    className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Task
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : isEditing
                    ? "Update Task"
                    : "Create Task"}
                </Button>
              </div>
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
                  <SelectContent className="max-h-60">
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
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Context"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md bg-white shadow-xl rounded-2xl border-0">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Delete Task
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Are you sure you want to delete &quot;
              <span className="font-medium">{task?.title}</span>&quot;? This
              action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteTask}
              disabled={isPending}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isPending ? "Deleting..." : "Delete Task"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

// Legacy component for backward compatibility and add button
export function AddItemModal({
  contexts,
  defaultContextId,
  addButtonSize = "lg",
}: {
  contexts: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
  defaultContextId?: string;
  addButtonSize?: "sm" | "lg";
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {addButtonSize === "sm" ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded-md transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>Add</span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      )}

      <TaskModal
        contexts={contexts}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultContextId={defaultContextId}
      />
    </>
  );
}
