import { diffInLocalCalendarDays } from "./date-utils";

export type HabitStatus = {
  status: "fresh" | "getting-due" | "ready" | "time-for-another";
  text: string;
  color: string;
  actionNeeded: boolean;
};

export function getHabitStatus(habit: {
  completedAt: Date | null;
  frequency: number | null;
}): HabitStatus | null {
  if (!habit.completedAt || !habit.frequency) return null;

  const today = new Date();
  const completedAt = new Date(habit.completedAt);

  const nextDueDate = new Date(completedAt);
  nextDueDate.setDate(nextDueDate.getDate() + habit.frequency);
  const daysUntilDue = diffInLocalCalendarDays(nextDueDate, today);

  // If it was completed today, don't show the status
  if (diffInLocalCalendarDays(today, completedAt) < 1) {
    return null;
  }

  if (daysUntilDue > 1) {
    return {
      status: "fresh",
      text: "✓ Fresh",
      color: "text-green-600",
      actionNeeded: false,
    };
  } else if (daysUntilDue === 1) {
    return {
      status: "getting-due",
      text: "⏰ Getting due",
      color: "text-yellow-600",
      actionNeeded: false,
    };
  } else if (daysUntilDue === 0) {
    return {
      status: "ready",
      text: "⚡ Ready",
      color: "text-blue-600",
      actionNeeded: true,
    };
  } else {
    return {
      status: "time-for-another",
      text: "🔄 Time for another",
      color: "text-orange-600",
      actionNeeded: true,
    };
  }
}

export type HabitDisplay = {
  iconType: "dumbbell" | "book" | "flame" | "wrench";
  iconColor: string;
  primaryText: string;
  secondaryText: string | null;
  showLarge: boolean;
};

export function getHabitDisplay(task: {
  type: "TASK" | "HABIT" | "RECURRING";
  habitType?: "STREAK" | "LEARNING" | "WELLNESS" | "MAINTENANCE" | null;
  streak?: number | null;
  longestStreak?: number | null;
  frequency?: number | null;
}): HabitDisplay | null {
  if (task.type !== "HABIT" || !task.habitType) return null;

  const getHabitIcon = (habitType: string) => {
    switch (habitType) {
      case "STREAK":
        return { icon: "dumbbell" as const, color: "text-red-500" };
      case "LEARNING":
        return { icon: "book" as const, color: "text-blue-500" };
      case "WELLNESS":
        return { icon: "flame" as const, color: "text-green-500" };
      case "MAINTENANCE":
        return { icon: "wrench" as const, color: "text-gray-500" };
      default:
        return { icon: "flame" as const, color: "text-orange-500" };
    }
  };

  const habitIcon = getHabitIcon(task.habitType);

  // All habit types use consistent minimal styling
  const streak = task.streak || 0;
  const longestStreak = task.longestStreak;
  const frequency = task.frequency;

  if (task.habitType === "STREAK") {
    return {
      iconType: habitIcon.icon,
      iconColor: habitIcon.color,
      primaryText: String(streak),
      secondaryText: longestStreak ? `(best: ${longestStreak})` : null,
      showLarge: false,
    };
  }

  if (task.habitType === "LEARNING") {
    return {
      iconType: habitIcon.icon,
      iconColor: habitIcon.color,
      primaryText: String(streak),
      secondaryText: longestStreak ? `(best: ${longestStreak})` : null,
      showLarge: false,
    };
  }

  if (task.habitType === "WELLNESS") {
    return {
      iconType: habitIcon.icon,
      iconColor: habitIcon.color,
      primaryText: String(streak),
      secondaryText: frequency ? `every ${frequency}d` : null,
      showLarge: false,
    };
  }

  if (task.habitType === "MAINTENANCE") {
    return {
      iconType: habitIcon.icon,
      iconColor: habitIcon.color,
      primaryText: frequency ? `every ${frequency}d` : String(streak),
      secondaryText: null,
      showLarge: false,
    };
  }

  return null;
}
