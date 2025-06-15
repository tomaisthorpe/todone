import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateUrgency(task: {
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date | null;
  createdAt: Date;
  tags: string[];
}): number {
  let urgency = 5.0; // Base urgency

  // Priority weight
  switch (task.priority) {
    case "HIGH":
      urgency += 2.0;
      break;
    case "MEDIUM":
      urgency += 1.0;
      break;
    case "LOW":
      urgency += 0.0;
      break;
  }

  // Age weight (older tasks get more urgent)
  const ageInDays = Math.floor(
    (Date.now() - task.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  urgency += Math.min(ageInDays * 0.1, 2.0);

  // Due date weight
  if (task.dueDate) {
    const daysUntilDue = Math.floor(
      (task.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysUntilDue <= 0) {
      urgency += 3.0; // Overdue
    } else if (daysUntilDue <= 1) {
      urgency += 2.0; // Due today/tomorrow
    } else if (daysUntilDue <= 3) {
      urgency += 1.0; // Due soon
    }
  }

  // Tag weight
  const urgentTags = ["urgent", "important", "critical"];
  const hasUrgentTag = task.tags.some(tag => 
    urgentTags.includes(tag.toLowerCase())
  );
  if (hasUrgentTag) {
    urgency += 1.5;
  }

  return Math.min(Math.max(urgency, 0), 10); // Clamp between 0 and 10
}

export function explainUrgency(task: {
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date | null;
  createdAt: Date;
  tags: string[];
}): { score: number; explanation: string[] } {
  let urgency = 5.0;
  const explanation: string[] = [];
  
  explanation.push("Base urgency: 5.0");

  // Priority weight
  switch (task.priority) {
    case "HIGH":
      urgency += 2.0;
      explanation.push("High priority: +2.0");
      break;
    case "MEDIUM":
      urgency += 1.0;
      explanation.push("Medium priority: +1.0");
      break;
    case "LOW":
      urgency += 0.0;
      explanation.push("Low priority: +0.0");
      break;
  }

  // Age weight (older tasks get more urgent)
  const ageInDays = Math.floor(
    (Date.now() - task.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  const ageWeight = Math.min(ageInDays * 0.1, 2.0);
  urgency += ageWeight;
  explanation.push(`Task age (${ageInDays} days): +${ageWeight.toFixed(1)}`);

  // Due date weight
  if (task.dueDate) {
    const daysUntilDue = Math.floor(
      (task.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysUntilDue <= 0) {
      urgency += 3.0;
      explanation.push(`Overdue (${Math.abs(daysUntilDue)} days): +3.0`);
    } else if (daysUntilDue <= 1) {
      urgency += 2.0;
      explanation.push(`Due ${daysUntilDue === 0 ? 'today' : 'tomorrow'}: +2.0`);
    } else if (daysUntilDue <= 3) {
      urgency += 1.0;
      explanation.push(`Due in ${daysUntilDue} days: +1.0`);
    } else {
      explanation.push(`Due in ${daysUntilDue} days: +0.0`);
    }
  } else {
    explanation.push("No due date: +0.0");
  }

  // Tag weight
  const urgentTags = ["urgent", "important", "critical"];
  const hasUrgentTag = task.tags.some(tag => 
    urgentTags.includes(tag.toLowerCase())
  );
  if (hasUrgentTag) {
    urgency += 1.5;
    explanation.push("Urgent tags: +1.5");
  } else {
    explanation.push("No urgent tags: +0.0");
  }

  const finalScore = Math.min(Math.max(urgency, 0), 10);
  
  if (finalScore !== urgency) {
    explanation.push(`Clamped to range [0-10]: ${finalScore.toFixed(1)}`);
  }

  return { score: finalScore, explanation };
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

export function formatDate(date: Date): string {
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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
  
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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