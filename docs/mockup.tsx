import React, { useState } from "react";
import {
  Plus,
  Settings,
  CheckCircle2,
  Circle,
  Clock,
  Tag,
  Flame,
  Home,
  Briefcase,
  Code,
  Coffee,
  Car,
  Calendar,
  AlertCircle,
  Dumbbell,
  BookOpen,
  Wrench,
  ChevronDown,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

const Todone = () => {
  const [collapsedContexts, setCollapsedContexts] = useState(new Set());

  const [tasks, setTasks] = useState([
    // Today's priority tasks
    {
      id: 1,
      title: "Fix authentication bug in user dashboard",
      project: "SideProject A",
      priority: "high",
      tags: ["bug", "urgent"],
      context: "coding",
      dueDate: "2025-06-15",
      urgency: 8.5,
      completed: false,
      type: "task",
    },
    {
      id: 2,
      title: "Morning workout",
      project: "Health",
      priority: "medium",
      tags: ["fitness"],
      context: "bedroom",
      dueDate: "2025-06-15",
      urgency: 7.8,
      completed: true,
      type: "habit",
      habitType: "streak",
      streak: 12,
      longestStreak: 28,
      frequency: 1,
      lastCompleted: "2025-06-15",
    },

    // Coding context
    {
      id: 3,
      title: "Deploy staging environment",
      project: "SideProject A",
      priority: "high",
      tags: ["deployment"],
      context: "coding",
      dueDate: "2025-06-17",
      urgency: 7.9,
      completed: false,
      type: "task",
    },
    {
      id: 4,
      title: "Review pull requests",
      project: "SideProject B",
      priority: "medium",
      tags: ["review"],
      context: "coding",
      dueDate: null,
      urgency: 6.2,
      completed: true,
      type: "task",
    },
    {
      id: 5,
      title: "Update documentation",
      project: "SideProject A",
      priority: "low",
      tags: ["docs"],
      context: "coding",
      dueDate: "2025-06-20",
      urgency: 4.1,
      completed: false,
      type: "task",
    },
    {
      id: 15,
      title: "Daily coding practice",
      project: "Learning",
      priority: "medium",
      tags: ["learning", "coding"],
      context: "coding",
      dueDate: null,
      urgency: 6.5,
      completed: false,
      type: "habit",
      habitType: "learning",
      streak: 7,
      longestStreak: 15,
      frequency: 1,
      lastCompleted: "2025-06-14",
    },
    {
      id: 18,
      title: "Weekly team standup",
      project: "Work",
      priority: "medium",
      tags: ["meeting", "recurring"],
      context: "coding",
      dueDate: "2025-06-16",
      urgency: 6.8,
      completed: false,
      type: "recurring",
      frequency: 7,
      nextDue: "2025-06-16",
    },

    // Bathroom context
    {
      id: 6,
      title: "Charge electric toothbrush",
      project: "Maintenance",
      priority: "low",
      tags: ["maintenance"],
      context: "bathroom",
      dueDate: "2025-06-16",
      urgency: 3.2,
      completed: false,
      type: "task",
    },
    {
      id: 7,
      title: "Clean bathroom sink",
      project: "Cleaning",
      priority: "medium",
      tags: ["cleaning"],
      context: "bathroom",
      dueDate: null,
      urgency: 5.5,
      completed: false,
      type: "habit",
      habitType: "maintenance",
      streak: 3,
      frequency: 7,
      lastCompleted: "2025-06-12",
    },
    {
      id: 8,
      title: "Replace toilet paper",
      project: "Maintenance",
      priority: "low",
      tags: ["supplies"],
      context: "bathroom",
      dueDate: "2025-06-14",
      urgency: 2.8,
      completed: false,
      type: "task",
    },
    {
      id: 13,
      title: "Deep clean shower",
      project: "Cleaning",
      priority: "medium",
      tags: ["cleaning", "deep"],
      context: "bathroom",
      dueDate: null,
      urgency: 6.8,
      completed: false,
      type: "habit",
      habitType: "maintenance",
      streak: 2,
      frequency: 14,
      lastCompleted: "2025-06-01",
    },
    {
      id: 16,
      title: "Evening skincare routine",
      project: "Self-Care",
      priority: "low",
      tags: ["skincare", "routine"],
      context: "bathroom",
      dueDate: null,
      urgency: 4.8,
      completed: false,
      type: "habit",
      habitType: "wellness",
      streak: 18,
      longestStreak: 32,
      frequency: 1,
      lastCompleted: "2025-06-14",
    },

    // Kitchen context
    {
      id: 9,
      title: "Wipe down counters",
      project: "Cleaning",
      priority: "medium",
      tags: ["cleaning"],
      context: "kitchen",
      dueDate: "2025-06-15",
      urgency: 6.1,
      completed: true,
      type: "habit",
      habitType: "maintenance",
      streak: 5,
      frequency: 1,
      lastCompleted: "2025-06-15",
    },
    {
      id: 10,
      title: "Empty dishwasher",
      project: "Cleaning",
      priority: "medium",
      tags: ["dishes"],
      context: "kitchen",
      dueDate: "2025-06-15",
      urgency: 5.8,
      completed: false,
      type: "task",
    },
    {
      id: 11,
      title: "Add fabric softener",
      project: "Laundry",
      priority: "low",
      tags: ["laundry"],
      context: "kitchen",
      dueDate: null,
      urgency: 3.5,
      completed: false,
      type: "task",
    },
    {
      id: 14,
      title: "Clean refrigerator",
      project: "Cleaning",
      priority: "low",
      tags: ["cleaning", "weekly"],
      context: "kitchen",
      dueDate: null,
      urgency: 4.2,
      completed: false,
      type: "habit",
      habitType: "maintenance",
      streak: 4,
      frequency: 7,
      lastCompleted: "2025-06-13",
    },

    // Bedroom context
    {
      id: 12,
      title: "Make bed",
      project: "Morning Routine",
      priority: "low",
      tags: ["routine"],
      context: "bedroom",
      dueDate: null,
      urgency: 4.2,
      completed: true,
      type: "habit",
      habitType: "wellness",
      streak: 8,
      longestStreak: 22,
      frequency: 1,
      lastCompleted: "2025-06-15",
    },
    {
      id: 17,
      title: "Read before bed",
      project: "Learning",
      priority: "low",
      tags: ["reading", "routine"],
      context: "bedroom",
      dueDate: null,
      urgency: 5.2,
      completed: false,
      type: "habit",
      habitType: "learning",
      streak: 9,
      longestStreak: 18,
      frequency: 1,
      lastCompleted: "2025-06-14",
    },
  ]);

  const contexts = [
    {
      id: "coding",
      name: "Coding",
      icon: Code,
      color: "bg-blue-500",
      description: "Development work",
    },
    {
      id: "bathroom",
      name: "Bathroom",
      icon: Home,
      color: "bg-cyan-500",
      description: "Bathroom tasks & cleaning",
    },
    {
      id: "kitchen",
      name: "Kitchen",
      icon: Coffee,
      color: "bg-green-500",
      description: "Kitchen & cooking tasks",
    },
    {
      id: "bedroom",
      name: "Bedroom",
      icon: Home,
      color: "bg-purple-500",
      description: "Bedroom & sleep routine",
    },
  ];

  const toggleContextCollapse = (contextId) => {
    const newCollapsed = new Set(collapsedContexts);
    if (newCollapsed.has(contextId)) {
      newCollapsed.delete(contextId);
    } else {
      newCollapsed.add(contextId);
    }
    setCollapsedContexts(newCollapsed);
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getContextCompletion = (contextId) => {
    // Only habits contribute to context health, not one-off tasks
    const contextHabits = tasks.filter(
      (task) => task.context === contextId && task.type === "habit"
    );
    if (contextHabits.length === 0)
      return { percentage: 100, completed: 0, total: 0 };

    const completed = contextHabits.filter((task) => task.completed).length;
    const total = contextHabits.length;
    const percentage = Math.round((completed / total) * 100);

    return { percentage, completed, total };
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return "text-green-600 bg-green-100";
    if (percentage >= 50) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getTodayTasks = () => {
    const today = "2025-06-15";
    return tasks
      .filter((task) => task.dueDate === today)
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return b.urgency - a.urgency;
      });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const today = new Date("2025-06-15");
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 0)
      return {
        text: "Today",
        color: "text-blue-600 bg-blue-100",
        isOverdue: false,
      };
    if (diffDays === 1)
      return {
        text: "Tomorrow",
        color: "text-green-600 bg-green-100",
        isOverdue: false,
      };
    if (diffDays === -1)
      return {
        text: "Yesterday",
        color: "text-red-600 bg-red-100",
        isOverdue: true,
      };
    if (diffDays < 0)
      return {
        text: `${Math.abs(diffDays)}d overdue`,
        color: "text-red-600 bg-red-100",
        isOverdue: true,
      };
    if (diffDays < 7)
      return {
        text: `In ${diffDays}d`,
        color: "text-gray-600 bg-gray-100",
        isOverdue: false,
      };
    return {
      text: date.toLocaleDateString(),
      color: "text-gray-600 bg-gray-100",
      isOverdue: false,
    };
  };

  const getHabitIcon = (habitType) => {
    switch (habitType) {
      case "streak":
        return { icon: "dumbbell", color: "text-red-500" };
      case "learning":
        return { icon: "book", color: "text-blue-500" };
      case "wellness":
        return { icon: "flame", color: "text-green-500" };
      case "maintenance":
        return { icon: "wrench", color: "text-gray-500" };
      default:
        return { icon: "flame", color: "text-orange-500" };
    }
  };

  const getHabitDisplay = (task) => {
    if (task.type !== "habit") return null;

    const habitIcon = getHabitIcon(task.habitType);

    // Streak habits show prominent streak info
    if (task.habitType === "streak") {
      return {
        iconType: habitIcon.icon,
        iconColor: habitIcon.color,
        primaryText: task.streak,
        secondaryText: task.longestStreak
          ? `best: ${task.longestStreak}`
          : null,
        showLarge: true,
      };
    }

    // Learning habits show streak with some prominence
    if (task.habitType === "learning") {
      return {
        iconType: habitIcon.icon,
        iconColor: habitIcon.color,
        primaryText: task.streak,
        secondaryText: task.longestStreak ? `/${task.longestStreak}` : null,
        showLarge: false,
      };
    }

    // Wellness habits show balanced info
    if (task.habitType === "wellness") {
      return {
        iconType: habitIcon.icon,
        iconColor: habitIcon.color,
        primaryText: task.streak,
        secondaryText: task.frequency ? `/${task.frequency}d` : null,
        showLarge: false,
      };
    }

    // Maintenance habits de-emphasize streak
    if (task.habitType === "maintenance") {
      return {
        iconType: habitIcon.icon,
        iconColor: habitIcon.color,
        primaryText: task.frequency ? `/${task.frequency}d` : task.streak,
        secondaryText: null,
        showLarge: false,
      };
    }

    return null;
  };

  const getHabitStatus = (habit) => {
    if (!habit.lastCompleted || !habit.frequency) return null;

    const today = new Date("2025-06-15");
    const lastCompleted = new Date(habit.lastCompleted);
    const daysSinceCompleted = Math.floor(
      (today - lastCompleted) / (1000 * 60 * 60 * 24)
    );
    const nextDueDate = new Date(lastCompleted);
    nextDueDate.setDate(nextDueDate.getDate() + habit.frequency);
    const daysUntilDue = Math.ceil(
      (nextDueDate - today) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilDue > 1) {
      return {
        status: "fresh",
        text: `✓ Fresh`,
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
      const daysOverdue = Math.abs(daysUntilDue);
      return {
        status: "time-for-another",
        text: `🔄 Time for another`,
        color: "text-orange-700 bg-orange-100",
        actionNeeded: true,
      };
    }
  };

  const renderHabitIcon = (iconType, className) => {
    switch (iconType) {
      case "dumbbell":
        return <Dumbbell className={className} />;
      case "book":
        return <BookOpen className={className} />;
      case "flame":
        return <Flame className={className} />;
      case "wrench":
        return <Wrench className={className} />;
      default:
        return <Flame className={className} />;
    }
  };

  const TaskCard = ({ task, compact = false }) => {
    const dateInfo = formatDate(task.dueDate);
    const habitStatus = task.type === "habit" ? getHabitStatus(task) : null;
    const habitDisplay = getHabitDisplay(task);

    return (
      <div
        className={`flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg ${
          task.completed ? "opacity-60" : ""
        }`}
      >
        <button
          onClick={() => toggleTask(task.id)}
          className="mt-0.5 flex-shrink-0"
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3
                  className={`font-medium text-sm ${
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-900"
                  }`}
                >
                  {task.title}
                </h3>
                {task.type === "recurring" && (
                  <div className="flex items-center space-x-1">
                    <RotateCcw className="w-3 h-3 text-purple-500" />
                    <span className="text-xs text-purple-600 font-medium">
                      Every {task.frequency}d
                    </span>
                  </div>
                )}
                {habitDisplay && (
                  <div
                    className={`flex items-center space-x-1 ${
                      habitDisplay.showLarge
                        ? "bg-red-50 px-2 py-1 rounded-md border border-red-200"
                        : ""
                    }`}
                  >
                    {renderHabitIcon(
                      habitDisplay.iconType,
                      `${habitDisplay.showLarge ? "w-4 h-4" : "w-3 h-3"} ${
                        habitDisplay.iconColor
                      }`
                    )}
                    <span
                      className={`${
                        habitDisplay.showLarge
                          ? "text-sm font-bold text-red-700"
                          : "text-xs font-medium text-orange-600"
                      }`}
                    >
                      {habitDisplay.primaryText}
                    </span>
                    {habitDisplay.secondaryText && (
                      <span className="text-xs text-gray-500">
                        {habitDisplay.secondaryText}
                      </span>
                    )}
                  </div>
                )}
                {dateInfo?.isOverdue && (
                  <AlertCircle className="w-3 h-3 text-red-500" />
                )}
              </div>
              {!compact && (
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-xs text-gray-500">{task.project}</span>
                  {task.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 ml-2">
              {habitStatus && (
                <div
                  className={`px-1.5 py-0.5 rounded text-xs font-medium ${habitStatus.color}`}
                >
                  {habitStatus.text}
                </div>
              )}
              {dateInfo && (
                <div
                  className={`px-1.5 py-0.5 rounded text-xs font-medium ${dateInfo.color}`}
                >
                  {dateInfo.text}
                </div>
              )}
              <div
                className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                  task.urgency >= 7
                    ? "text-red-600 bg-red-100"
                    : task.urgency >= 5
                    ? "text-orange-600 bg-orange-100"
                    : "text-green-600 bg-green-100"
                }`}
              >
                {task.urgency.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ContextGroup = ({ context }) => {
    const contextTasks = tasks
      .filter((task) => task.context === context.id)
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return b.urgency - a.urgency;
      });

    const completion = getContextCompletion(context.id);
    const Icon = context.icon;

    // Separate habits from tasks (including recurring)
    const habits = contextTasks.filter((task) => task.type === "habit");
    const allTasks = contextTasks.filter(
      (task) => task.type === "task" || task.type === "recurring"
    );

    // Count tasks scheduled for today
    const todayTasksInContext = contextTasks.filter(
      (task) => task.dueDate === "2025-06-15"
    ).length;
    const isCollapsed = collapsedContexts.has(context.id);

    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className={`p-4 ${context.color} text-white`}>
          <button
            onClick={() => toggleContextCollapse(context.id)}
            className="w-full flex items-center justify-between hover:bg-white/10 rounded-lg p-2 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">{context.name}</h3>
                <p className="text-sm opacity-90">{context.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-white ${getCompletionColor(
                  completion.percentage
                )
                  .replace("bg-", "text-")
                  .replace("-100", "-700")}`}
              >
                {completion.percentage}%
              </div>
              <p className="text-xs opacity-90 mt-1">
                {completion.completed}/{completion.total} habits
              </p>
              {todayTasksInContext > 0 && (
                <p className="text-xs opacity-90 mt-1">
                  {todayTasksInContext} in Today
                </p>
              )}
            </div>
          </button>

          <div className="mt-3">
            <div className="w-full bg-white/30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${completion.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {!isCollapsed && (
          <div className="p-4">
            {contextTasks.length > 0 ? (
              <div className="space-y-1">
                {contextTasks.map((task) => (
                  <TaskCard key={task.id} task={task} compact />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No tasks in this context
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const todayTasks = getTodayTasks();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Todone</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Today Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Today</h2>
              </div>
              <div className="text-sm text-gray-500">
                {todayTasks.filter((t) => t.completed).length}/
                {todayTasks.length} completed
              </div>
            </div>
          </div>

          <div className="p-6">
            {todayTasks.length > 0 ? (
              <div className="space-y-2">
                {todayTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No tasks scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Context Groups */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Contexts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contexts.map((context) => (
              <ContextGroup key={context.id} context={context} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todone;
