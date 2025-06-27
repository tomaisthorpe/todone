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
import { TaskForm, type TaskFormData } from "@/components/task-form";
import {
  createTaskAction,
  updateTaskAction,
  createContextAction,
  deleteTaskAction,
  getExistingTags,
} from "@/lib/server-actions";
import {
  CheckSquare,
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
  Trash2,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import type { Task } from "@/lib/data";

// Context form schema
const contextSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  icon: z.string(),
  color: z.string(),
});

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

export function TaskModal({
  contexts,
  task,
  isOpen,
  onClose,
  defaultContextId,
}: TaskModalProps) {
  const [activeTab, setActiveTab] = useState<"task" | "context">("task");
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskFormData, setTaskFormData] = useState<TaskFormData>({
    title: "",
    project: "",
    priority: "MEDIUM",
    contextId: defaultContextId || "",
    dueDate: "",
    type: "TASK",
    habitType: undefined,
    frequency: undefined,
    tags: [],
  });

  // Generate unique IDs for this modal instance to prevent conflicts
  const modalId = useId();
  const getFieldId = (fieldName: string) => `${modalId}-${fieldName}`;

  const isEditing = !!task;

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
      setError(null); // Clear errors when modal opens
      if (task) {
        // Editing mode - populate form with task data
        setTaskFormData({
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
        setTaskFormData({
          title: "",
          project: "",
          priority: "MEDIUM",
          contextId: defaultContextId || "",
          dueDate: "",
          type: "TASK",
          habitType: undefined,
          frequency: undefined,
          tags: [],
        });
      }
    }
  }, [isOpen, task, defaultContextId]);

  const handleTaskFormChange = <K extends keyof TaskFormData>(field: K, value: TaskFormData[K]) => {
    setTaskFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user makes changes
    if (error) {
      setError(null);
    }
  };

  const onSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!taskFormData.title.trim()) return;
    if (!taskFormData.contextId) return;
    if (taskFormData.type === "RECURRING" && !taskFormData.frequency) return;

    // Clear any previous errors and set loading state
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    if (isEditing && task) {
      formData.append("taskId", task.id);
    }
    formData.append("title", taskFormData.title);
    if (taskFormData.project) formData.append("project", taskFormData.project);
    formData.append("priority", taskFormData.priority);
    formData.append("contextId", taskFormData.contextId);
    if (taskFormData.dueDate) formData.append("dueDate", taskFormData.dueDate);
    formData.append("type", taskFormData.type);
    if (taskFormData.habitType) formData.append("habitType", taskFormData.habitType);
    if (taskFormData.frequency)
      formData.append("frequency", taskFormData.frequency.toString());

    // Convert tags array to comma-separated string for form data
    formData.append("tags", taskFormData.tags.join(", "));

    try {
      if (isEditing) {
        await updateTaskAction(formData);
      } else {
        await createTaskAction(formData);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
      setError(error instanceof Error ? error.message : "Failed to save task");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitContext = async (data: ContextFormData) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    formData.append("icon", data.icon);
    formData.append("color", data.color);

    try {
      await createContextAction(formData);
      contextForm.reset();
      onClose();
    } catch (error) {
      console.error("Failed to create context:", error);
      setError(error instanceof Error ? error.message : "Failed to create context");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;
    setIsLoading(true);
    
    try {
      await deleteTaskAction(task.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error("Failed to delete task:", error);
      setError(error instanceof Error ? error.message : "Failed to delete task");
      setShowDeleteConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Validation errors for TaskForm
  const getTaskFormErrors = () => {
    const errors: Partial<Record<keyof TaskFormData, string>> = {};
    if (!taskFormData.title.trim()) {
      errors.title = "Title is required";
    }
    if (!taskFormData.contextId) {
      errors.contextId = "Context is required";
    }
    if (taskFormData.type === "RECURRING" && !taskFormData.frequency) {
      errors.frequency = "Frequency is required for recurring tasks";
    }
    return errors;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-xl rounded-2xl border-0"
      >
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Add New Item"}</DialogTitle>
        </DialogHeader>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

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
          <form onSubmit={onSubmitTask} className="space-y-4">
            <TaskForm
              data={taskFormData}
              onChange={handleTaskFormChange}
              contexts={contexts}
              existingTags={existingTags}
              errors={getTaskFormErrors()}
              compact={false}
              isEditing={isEditing}
              task={task}
              fieldIdPrefix={modalId}
            />

            <div className="flex justify-between pt-4">
              <div>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isLoading}
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Context"}
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
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteTask}
              disabled={isLoading}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete Task"}
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