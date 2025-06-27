"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagsInput } from "@/components/ui/tags-input";
import { 
  CheckSquare, RotateCcw, Dumbbell, BookOpen, Heart, Wrench, Home, Calendar,
  Code, Coffee, Building, Pizza, UtensilsCrossed, ChefHat, Wine, Beer, Grape,
  Salad, CookingPot, Croissant, IceCreamCone, Cake, Sandwich, Soup, Wallet,
  Coins, PiggyBank, CreditCard, Banknote, TrendingUp, Calculator, Receipt,
  Leaf, TreePine, Sprout, Flower, TreeDeciduous, Flower2, LeafyGreen, Trees,
  FlaskConical, TestTube, Beaker
} from "lucide-react";

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

const habitTypeIcons = {
  STREAK: { icon: Dumbbell, color: "text-red-500" },
  LEARNING: { icon: BookOpen, color: "text-blue-500" },
  WELLNESS: { icon: Heart, color: "text-green-500" },
  MAINTENANCE: { icon: Wrench, color: "text-gray-500" },
};

export interface TaskFormData {
  title: string;
  project: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  contextId: string;
  dueDate: string;
  type: "TASK" | "HABIT" | "RECURRING";
  habitType?: "STREAK" | "LEARNING" | "WELLNESS" | "MAINTENANCE";
  frequency?: number;
  tags: string[];
}

interface TaskFormProps {
  data: TaskFormData;
  onChange: <K extends keyof TaskFormData>(field: K, value: TaskFormData[K]) => void;
  contexts: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
  existingTags?: string[];
  errors?: Partial<Record<keyof TaskFormData, string>>;
  compact?: boolean;
  isEditing?: boolean;
  task?: {
    id: string;
    createdAt: Date;
  };
  fieldIdPrefix?: string;
}

export function TaskForm({
  data,
  onChange,
  contexts,
  existingTags = [],
  errors = {},
  compact = false,
  isEditing = false,
  task,
  fieldIdPrefix = "taskform",
}: TaskFormProps) {
  const getFieldId = (fieldName: string) => `${fieldIdPrefix}-${fieldName}`;

  const gridCols = compact ? "grid-cols-1" : "grid-cols-2";
  const gap = compact ? "gap-2" : "gap-4";
  const spacing = compact ? "space-y-2" : "space-y-4";

  return (
    <div className={spacing}>
      <div className={`grid ${gridCols} ${gap}`}>
        {/* Title */}
        <div className={compact ? "" : "col-span-2"}>
          <Label htmlFor={getFieldId("title")} className={compact ? "text-xs" : ""}>
            Task Title {!compact && "*"}
          </Label>
          <Input
            id={getFieldId("title")}
            value={data.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder={compact ? "Task title" : "What needs to be done?"}
            className={compact ? "text-sm mt-1" : ""}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Show creation date when editing in full mode */}
        {!compact && isEditing && task && (
          <div className="col-span-2">
            <Label>Created On</Label>
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date(task.createdAt).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Task Type - only in full mode */}
        {!compact && (
          <div>
            <Label htmlFor={getFieldId("type")}>Task Type</Label>
            <Select
              value={data.type}
              onValueChange={(value) => onChange("type", value as "TASK" | "HABIT" | "RECURRING")}
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
        )}

        {/* Priority */}
        <div>
          <Label htmlFor={getFieldId("priority")} className={compact ? "text-xs" : ""}>
            Priority
          </Label>
          <Select
            value={data.priority}
            onValueChange={(value) => onChange("priority", value as "LOW" | "MEDIUM" | "HIGH")}
          >
            <SelectTrigger className={compact ? "text-sm mt-1" : ""}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Context */}
        <div>
          <Label htmlFor={getFieldId("context")} className={compact ? "text-xs" : ""}>
            Context {!compact && "*"}
          </Label>
          <Select
            value={data.contextId}
            onValueChange={(value) => onChange("contextId", value)}
          >
            <SelectTrigger className={compact ? "text-sm mt-1" : ""}>
              <SelectValue placeholder="Select context" />
            </SelectTrigger>
            <SelectContent>
              {contexts.map((context) => {
                const IconComponent = contextIcons.find((c) => c.value === context.icon)?.icon || Home;
                return (
                  <SelectItem key={context.id} value={context.id}>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${context.color} mr-2`} />
                      <IconComponent className="w-4 h-4 mr-2" />
                      {context.name}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errors.contextId && (
            <p className="text-sm text-red-500 mt-1">{errors.contextId}</p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <Label htmlFor={getFieldId("dueDate")} className={compact ? "text-xs" : ""}>
            Due Date
          </Label>
          <Input
            id={getFieldId("dueDate")}
            type="datetime-local"
            value={data.dueDate}
            onChange={(e) => onChange("dueDate", e.target.value)}
            className={compact ? "text-sm mt-1" : ""}
          />
        </div>

        {/* Habit-specific fields - only in full mode */}
        {!compact && data.type === "HABIT" && (
          <>
            <div>
              <Label htmlFor={getFieldId("habitType")}>Habit Type</Label>
              <Select
                value={data.habitType || ""}
                onValueChange={(value) => onChange("habitType", value as "STREAK" | "LEARNING" | "WELLNESS" | "MAINTENANCE")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select habit type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(habitTypeIcons).map(([type, { icon: Icon, color }]) => (
                    <SelectItem key={type} value={type}>
                      <Icon className={`w-4 h-4 inline mr-2 ${color}`} />
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
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
                value={data.frequency || ""}
                onChange={(e) => onChange("frequency", parseInt(e.target.value) || undefined)}
              />
            </div>
          </>
        )}

        {/* Recurring task-specific fields - only in full mode */}
        {!compact && data.type === "RECURRING" && (
          <div>
            <Label htmlFor={getFieldId("frequency")}>Frequency (days) *</Label>
            <Input
              id={getFieldId("frequency")}
              type="number"
              min="1"
              max="365"
              placeholder="1 = daily, 7 = weekly, 30 = monthly"
              value={data.frequency || ""}
              onChange={(e) => onChange("frequency", parseInt(e.target.value) || undefined)}
            />
            {errors.frequency && (
              <p className="text-sm text-red-500 mt-1">{errors.frequency}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              How often this task should repeat (in days)
            </p>
          </div>
        )}

        {/* Project - only in full mode */}
        {!compact && (
          <div className="col-span-2">
            <Label htmlFor={getFieldId("project")}>Project</Label>
            <Input
              id={getFieldId("project")}
              value={data.project}
              onChange={(e) => onChange("project", e.target.value)}
              placeholder="Optional project name"
            />
          </div>
        )}

        {/* Tags */}
        <div className={compact ? "" : "col-span-2"}>
          <Label htmlFor={getFieldId("tags")} className={compact ? "text-xs" : ""}>
            Tags
          </Label>
          {compact ? (
            <Input
              value={data.tags.join(", ")}
              onChange={(e) => {
                const tags = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                onChange("tags", tags);
              }}
              placeholder="Comma-separated tags"
              className="text-sm mt-1"
            />
          ) : (
            <>
              <TagsInput
                value={data.tags}
                onChange={(tags) => onChange("tags", tags)}
                suggestions={existingTags}
                placeholder="Add tags (e.g., urgent, work, fitness)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Type tags and press Enter or comma to add. Start typing to see suggestions from existing tags.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}