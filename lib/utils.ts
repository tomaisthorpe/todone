import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { URGENCY_CONSTANTS } from "./urgency-config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type UrgencyInput = {
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date | null;
  createdAt: Date;
  tags: string[];
  project?: string | null;
  contextCoefficient?: number;
};

export type UrgencyResult = {
  score: number;
  explanation: string[];
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function evaluateUrgency(task: UrgencyInput): UrgencyResult {
  let urgency = 0;
  const explanation: string[] = [];

  const add = (delta: number, label: string) => {
    urgency += delta;
    explanation.push(`${label}: ${delta >= 0 ? "+" : ""}${delta.toFixed(2)}`);
  };

  // Priority (mirror Taskwarrior values via normalized * coefficient)
  const prioNorm = URGENCY_CONSTANTS.priority.normalized[
    task.priority
  ];
  const prioContribution = prioNorm * URGENCY_CONSTANTS.priority.coefficient;
  add(prioContribution, `${task.priority[0]}${task.priority.slice(1).toLowerCase()} priority`);

  // Age factor
  const ageInDays = diffInLocalCalendarDays(new Date(), task.createdAt);
  const ageNorm = clamp(
    ageInDays / URGENCY_CONSTANTS.age.horizonDays,
    0,
    1
  );
  const ageContribution = ageNorm * URGENCY_CONSTANTS.age.coefficient;
  add(ageContribution, `Task age (${ageInDays} days)`);

  // Due date proximity (days only)
  if (task.dueDate) {
    const daysUntilDue = diffInLocalCalendarDays(task.dueDate);
    let proximity = 0;
    if (daysUntilDue >= 0) {
      proximity = clamp(
        (URGENCY_CONSTANTS.due.nearWindowDays - daysUntilDue) /
          URGENCY_CONSTANTS.due.nearWindowDays,
        0,
        1
      );
    } else {
      const overdueDays = Math.abs(daysUntilDue);
      // Overdue should be at least as urgent as due today.
      // Start at 1 and increase up to 2 as it saturates.
      proximity = 1 + clamp(
        overdueDays / URGENCY_CONSTANTS.due.overdueSaturationDays,
        0,
        1
      );
    }
    const dueContribution = proximity * URGENCY_CONSTANTS.due.coefficient;
    const label =
      daysUntilDue < 0
        ? `Overdue (${Math.abs(daysUntilDue)} days)`
        : `Due in ${daysUntilDue} days`;
    add(dueContribution, label);
  } else {
    add(0.0, "No due date");
  }

  // Project contribution: fixed 1 * coefficient if project exists
  if (task.project && task.project.trim().length > 0) {
    add(1 * URGENCY_CONSTANTS.project.coefficient, "Project set");
  }

  // Special tags contribution
  if (task.tags && task.tags.length > 0) {
    const normalized = task.tags.map((t) => t.toLowerCase());
    if (normalized.includes("next")) {
      add(URGENCY_CONSTANTS.tags.special.next, "Tag: next");
    }
    if (normalized.includes("blocked")) {
      add(URGENCY_CONSTANTS.tags.special.blocked, "Tag: blocked");
    }
  }

  // Context coefficient contribution
  if (task.contextCoefficient !== undefined && task.contextCoefficient !== 0) {
    add(task.contextCoefficient, `Context coefficient`);
  }

  return { score: urgency, explanation };
}

export function calculateUrgency(task: UrgencyInput): number {
  return evaluateUrgency(task).score;
}

export function explainUrgency(task: UrgencyInput): UrgencyResult {
  return evaluateUrgency(task);
}

export function parseTags(tagsString: string): string[] {
  if (!tagsString.trim()) return [];
  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

export function formatTagsForInput(tags: string[]): string {
  return tags.join(', ');
}

export function diffInLocalCalendarDays(target: Date, base: Date = new Date()): number {
  const targetUTC = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  const baseUTC = Date.UTC(base.getFullYear(), base.getMonth(), base.getDate());
  return Math.round((targetUTC - baseUTC) / 86400000);
}

export function formatDate(date: Date): string {
  const diffDays = diffInLocalCalendarDays(date);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays < 7) return `In ${diffDays}d`;
  
  return date.toLocaleDateString();
}

export function getUrgencyColor(urgency: number): string {
  const { highThreshold, mediumThreshold } = URGENCY_CONSTANTS.colors;
  if (urgency >= highThreshold) return "text-red-600 bg-red-100";
  if (urgency >= mediumThreshold) return "text-orange-600 bg-orange-100";
  return "text-green-600 bg-green-100";
}

export function formatDateForTask(date: Date | null): { text: string; color: string; isOverdue: boolean } | null {
  if (!date) return null;
  
  const diffDays = diffInLocalCalendarDays(date);

  if (diffDays === 0) {
    return {
      text: "Today",
      color: "text-blue-600 bg-blue-100",
      isOverdue: false,
    };
  }
  if (diffDays === 1) {
    return {
      text: "Tomorrow",
      color: "text-green-600 bg-green-100",
      isOverdue: false,
    };
  }
  if (diffDays === -1) {
    return {
      text: "Yesterday",
      color: "text-red-600 bg-red-100",
      isOverdue: true,
    };
  }
  if (diffDays < 0) {
    return {
      text: `${Math.abs(diffDays)}d overdue`,
      color: "text-red-600 bg-red-100",
      isOverdue: true,
    };
  }
  if (diffDays < 7) {
    return {
      text: `In ${diffDays}d`,
      color: "text-gray-600 bg-gray-100",
      isOverdue: false,
    };
  }
  
  return {
    text: date.toLocaleDateString(),
    color: "text-gray-600 bg-gray-100",
    isOverdue: false,
  };
}

export function shouldHideCompletedTask(task: { completed: boolean; completedAt: Date | null; type?: string }): boolean {
  // Never hide habits - they are ongoing behaviors that should always be visible
  if (task.type === "HABIT") {
    return false;
  }

  if (!task.completed || !task.completedAt) {
    return false; // Don't hide uncompleted tasks or tasks without completedAt
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completedDate = new Date(task.completedAt);
  const completedDateOnly = new Date(completedDate);
  completedDateOnly.setHours(0, 0, 0, 0);
  
  // If task was completed before today
  if (completedDateOnly.getTime() < today.getTime()) {
    // Check if it was completed less than an hour ago
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    // If completed less than an hour ago, don't hide it
    if (completedDate >= oneHourAgo) {
      return false;
    } else {
      // Hide tasks completed before today that are more than an hour old
      return true;
    }
  }

  // Don't hide tasks completed today
  return false;
}

export function shouldHabitShowAsAvailable(habit: {
  completed: boolean;
  lastCompleted: Date | null;
  frequency: number | null;
  type: string;
}): boolean {
  // Only apply to habits
  if (habit.type !== "HABIT") {
    return !habit.completed;
  }

  // If not completed, it's available
  if (!habit.completed) {
    return true;
  }

  // If no lastCompleted, show current completion state
  if (!habit.lastCompleted) {
    return !habit.completed;
  }

  // Calculate if we're in the next period after completion
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  
  const lastCompleted = new Date(habit.lastCompleted);
  const completedDate = new Date(lastCompleted);
  completedDate.setHours(0, 0, 0, 0);

  // Show as available the day after completion (allows early completion)
  const dayAfterCompletion = new Date(completedDate);
  dayAfterCompletion.setDate(dayAfterCompletion.getDate() + 1);

  // If it's the day after completion or later, show as available
  return today >= dayAfterCompletion;
}