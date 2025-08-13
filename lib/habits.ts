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
  const daysUntilDue = Math.ceil(
    (nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilDue > 1) {
    return {
      status: "fresh",
      text: "✓ Fresh",
      color: "text-green-700 bg-green-100",
      actionNeeded: false,
    };
  } else if (daysUntilDue === 1) {
    return {
      status: "getting-due",
      text: "⏰ Getting due",
      color: "text-yellow-700 bg-yellow-100",
      actionNeeded: false,
    };
  } else if (daysUntilDue === 0) {
    return {
      status: "ready",
      text: "⚡ Ready",
      color: "text-blue-700 bg-blue-100",
      actionNeeded: true,
    };
  } else {
    return {
      status: "time-for-another",
      text: "🔄 Time for another",
      color: "text-orange-700 bg-orange-100",
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

  // Streak habits show prominent streak info
  if (task.habitType === "STREAK") {
    return {
      iconType: habitIcon.icon,
      iconColor: habitIcon.color,
      primaryText: String(task.streak || 0),
      secondaryText: task.longestStreak ? `best: ${task.longestStreak}` : null,
      showLarge: true,
    };
  }

  // Learning habits show streak with some prominence
  if (task.habitType === "LEARNING") {
    return {
      iconType: habitIcon.icon,
      iconColor: habitIcon.color,
      primaryText: String(task.streak || 0),
      secondaryText: task.longestStreak ? `/${task.longestStreak}` : null,
      showLarge: false,
    };
  }

  // Wellness habits show balanced info
  if (task.habitType === "WELLNESS") {
    return {
      iconType: habitIcon.icon,
      iconColor: habitIcon.color,
      primaryText: String(task.streak || 0),
      secondaryText: task.frequency ? `/${task.frequency}d` : null,
      showLarge: false,
    };
  }

  // Maintenance habits de-emphasize streak
  if (task.habitType === "MAINTENANCE") {
    return {
      iconType: habitIcon.icon,
      iconColor: habitIcon.color,
      primaryText: task.frequency ? `/${task.frequency}d` : String(task.streak || 0),
      secondaryText: null,
      showLarge: false,
    };
  }

  return null;
}