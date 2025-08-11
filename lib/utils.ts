import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type UrgencyInput = {
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date | null;
  createdAt: Date;
  tags: string[];
};

export type UrgencyResult = {
  score: number;
  explanation: string[];
};

export function evaluateUrgency(task: UrgencyInput): UrgencyResult {
  let urgency = 0;
  const explanation: string[] = [];

  const add = (delta: number, label: string) => {
    urgency += delta;
    explanation.push(`${label}: ${delta >= 0 ? "+" : ""}${delta.toFixed(1)}`);
  };

  // Base
  add(5.0, "Base urgency");

  // Priority
  const priorityDelta =
    task.priority === "HIGH" ? 2.0 : task.priority === "MEDIUM" ? 1.0 : 0.0;
  const prettyPriority = `${task.priority[0]}${task.priority.slice(1).toLowerCase()}`;
  add(priorityDelta, `${prettyPriority} priority`);

  // Age
  const ageInDays = diffInLocalCalendarDays(new Date(), task.createdAt);
  const ageDelta = Math.min(ageInDays * 0.1, 2.0);
  add(ageDelta, `Task age (${ageInDays} days)`);

  // Due date
  if (task.dueDate) {
    const daysUntilDue = diffInLocalCalendarDays(task.dueDate);
    if (daysUntilDue < 0) add(3.0, `Overdue (${Math.abs(daysUntilDue)} days)`);
    else if (daysUntilDue === 0) add(2.5, "Due today");
    else if (daysUntilDue === 1) add(2.0, "Due tomorrow");
    else if (daysUntilDue <= 3) add(1.0, `Due in ${daysUntilDue} days`);
    else add(0.0, `Due in ${daysUntilDue} days`);
  } else {
    add(0.0, "No due date");
  }

  // Tags
  const urgentTags = ["urgent", "important", "critical"];
  const hasUrgentTag = task.tags.some((tag) => urgentTags.includes(tag.toLowerCase()));
  add(hasUrgentTag ? 1.5 : 0.0, hasUrgentTag ? "Urgent tags" : "No urgent tags");

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
  if (urgency >= 7) return "text-red-600 bg-red-100";
  if (urgency >= 5) return "text-orange-600 bg-orange-100";
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

export function shouldHideCompletedTask(task: { completed: boolean; completedAt: Date | null }): boolean {
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