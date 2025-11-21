import type { Meta, StoryObj } from '@storybook/react';
import { TaskCard } from './task-card';
import type { Task, Tag } from '@/lib/data';

const meta: Meta<typeof TaskCard> = {
  title: 'Components/TaskCard',
  component: TaskCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

// Mock data
const mockContexts = [
  {
    id: '1',
    name: 'Work',
    icon: 'briefcase',
    color: 'bg-blue-500',
    coefficient: 1.0,
    isInbox: false,
  },
  {
    id: '2',
    name: 'Home',
    icon: 'home',
    color: 'bg-green-500',
    coefficient: 0.8,
    isInbox: false,
  },
  {
    id: '3',
    name: 'Coding',
    icon: 'code',
    color: 'bg-purple-500',
    coefficient: 1.2,
    isInbox: false,
  },
];

const mockTags: Tag[] = [
  { id: '1', name: 'urgent', coefficient: 1.5, userId: 'user1' },
  { id: '2', name: 'bug', coefficient: 1.3, userId: 'user1' },
  { id: '3', name: 'feature', coefficient: 1.0, userId: 'user1' },
];

const baseTask: Task = {
  id: '1',
  title: 'Complete project documentation',
  description: null,
  notes: 'Make sure to include all API endpoints and usage examples',
  priority: 'MEDIUM',
  urgency: 8.5,
  completed: false,
  completedAt: null,
  dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  waitDays: null,
  createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  updatedAt: new Date(),
  contextId: '1',
  userId: 'user1',
  project: 'Documentation',
  tags: ['urgent', 'feature'],
  type: 'TASK',
  habitType: null,
  frequency: null,
  habitStreak: null,
  lastHabitCompletion: null,
  subtasks: [
    { id: '1', text: 'Write API documentation', completed: true },
    { id: '2', text: 'Add usage examples', completed: false },
    { id: '3', text: 'Review with team', completed: false },
  ],
};

export const Default: Story = {
  args: {
    task: baseTask,
    contexts: mockContexts,
    tags: mockTags,
    showContext: true,
    showUrgency: true,
  },
};

export const HighPriority: Story = {
  args: {
    task: {
      ...baseTask,
      title: 'Fix critical production bug',
      priority: 'HIGH',
      urgency: 15.2,
      tags: ['urgent', 'bug'],
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    },
    contexts: mockContexts,
    tags: mockTags,
    showContext: true,
    showUrgency: true,
  },
};

export const LowPriority: Story = {
  args: {
    task: {
      ...baseTask,
      title: 'Refactor utility functions',
      priority: 'LOW',
      urgency: 3.2,
      tags: ['feature'],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    },
    contexts: mockContexts,
    tags: mockTags,
    showContext: true,
    showUrgency: true,
  },
};

export const Completed: Story = {
  args: {
    task: {
      ...baseTask,
      title: 'Setup development environment',
      completed: true,
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      urgency: 5.0,
    },
    contexts: mockContexts,
    tags: mockTags,
    showContext: true,
    showUrgency: true,
  },
};

export const Overdue: Story = {
  args: {
    task: {
      ...baseTask,
      title: 'Submit quarterly report',
      priority: 'HIGH',
      urgency: 18.5,
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      tags: ['urgent'],
    },
    contexts: mockContexts,
    tags: mockTags,
    showContext: true,
    showUrgency: true,
  },
};

export const HabitStreak: Story = {
  args: {
    task: {
      ...baseTask,
      title: 'Morning meditation',
      type: 'HABIT',
      habitType: 'STREAK',
      frequency: 1, // Daily
      habitStreak: 7,
      lastHabitCompletion: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      completed: false, // Will show as available
      urgency: 6.0,
      contextId: '2',
      tags: [],
      subtasks: [],
    },
    contexts: mockContexts,
    tags: mockTags,
    showContext: true,
    showUrgency: true,
  },
};

export const HabitLearning: Story = {
  args: {
    task: {
      ...baseTask,
      title: 'Practice coding algorithms',
      type: 'HABIT',
      habitType: 'LEARNING',
      frequency: 2, // Every 2 days
      habitStreak: 3,
      lastHabitCompletion: new Date(Date.now() - 36 * 60 * 60 * 1000), // 36 hours ago
      completedAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
      completed: false,
      urgency: 5.5,
      contextId: '3',
      tags: [],
      subtasks: [],
    },
    contexts: mockContexts,
    tags: mockTags,
    showContext: true,
    showUrgency: true,
  },
};

export const RecurringTask: Story = {
  args: {
    task: {
      ...baseTask,
      title: 'Team standup meeting',
      type: 'RECURRING',
      frequency: 7, // Weekly
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      urgency: 7.0,
      tags: [],
      subtasks: [],
    },
    contexts: mockContexts,
    tags: mockTags,
    showContext: true,
    showUrgency: true,
  },
};

export const WithoutContext: Story = {
  args: {
    task: baseTask,
    contexts: mockContexts,
    tags: mockTags,
    showContext: false,
    showUrgency: true,
  },
};

export const WithoutUrgency: Story = {
  args: {
    task: baseTask,
    contexts: mockContexts,
    tags: mockTags,
    showContext: true,
    showUrgency: false,
  },
};

export const WithSubtasks: Story = {
  args: {
    task: {
      ...baseTask,
      title: 'Implement new feature',
      subtasks: [
        { id: '1', text: 'Design UI mockups', completed: true },
        { id: '2', text: 'Implement backend API', completed: true },
        { id: '3', text: 'Create frontend components', completed: false },
        { id: '4', text: 'Write unit tests', completed: false },
        { id: '5', text: 'Update documentation', completed: false },
      ],
    },
    contexts: mockContexts,
    tags: mockTags,
    showContext: true,
    showUrgency: true,
  },
};

export const WithSearchHighlight: Story = {
  args: {
    task: {
      ...baseTask,
      title: 'Complete project documentation',
      project: 'Documentation System',
      notes: 'Make sure to include all API endpoints and usage examples',
    },
    contexts: mockContexts,
    tags: mockTags,
    showContext: true,
    showUrgency: true,
    searchQuery: 'documentation',
  },
};

export const NoTags: Story = {
  args: {
    task: {
      ...baseTask,
      tags: [],
      subtasks: [],
    },
    contexts: mockContexts,
    tags: mockTags,
    showContext: true,
    showUrgency: true,
  },
};

export const LongTitle: Story = {
  args: {
    task: {
      ...baseTask,
      title: 'This is a very long task title that demonstrates how the component handles text wrapping and layout when the title extends beyond the normal width of the card',
      tags: ['feature', 'urgent', 'bug'],
      notes: 'This is also a very long note that contains a lot of information about the task and what needs to be done to complete it successfully.',
    },
    contexts: mockContexts,
    tags: mockTags,
    showContext: true,
    showUrgency: true,
  },
};
