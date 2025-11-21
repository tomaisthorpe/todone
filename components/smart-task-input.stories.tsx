import type { Meta, StoryObj } from '@storybook/react';
import { SmartTaskInput } from './smart-task-input';

const meta: Meta<typeof SmartTaskInput> = {
  title: 'Components/SmartTaskInput',
  component: SmartTaskInput,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onTaskCreated: { action: 'task created' },
  },
};

export default meta;
type Story = StoryObj<typeof SmartTaskInput>;

// Mock contexts data
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
  {
    id: '4',
    name: 'Personal Projects',
    icon: 'folder',
    color: 'bg-yellow-500',
    coefficient: 0.9,
    isInbox: false,
  },
  {
    id: '5',
    name: 'Inbox',
    icon: 'inbox',
    color: 'bg-gray-500',
    coefficient: 0.5,
    isInbox: true,
  },
];

export const Default: Story = {
  args: {
    contexts: mockContexts,
    defaultValue: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty input - start typing to see natural language parsing in action',
      },
    },
  },
};

export const WithContext: Story = {
  args: {
    contexts: mockContexts,
    defaultValue: 'Setup unwhelm !Coding #sideprojects p1 tomorrow',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows context (!Coding), tags (#sideprojects), priority (p1), and date (tomorrow) highlighting',
      },
    },
  },
};

export const RecurringTaskExample: Story = {
  args: {
    contexts: mockContexts,
    defaultValue: 'Team standup meeting every week !Work #meetings p2',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates recurring task pattern with "every week" highlighted in cyan',
      },
    },
  },
};

export const HighPriorityTask: Story = {
  args: {
    contexts: mockContexts,
    defaultValue: 'Fix critical bug !Work #urgent #bug p1 today',
  },
  parameters: {
    docs: {
      description: {
        story: 'High priority task with multiple tags and urgent due date',
      },
    },
  },
};

export const DailyHabitExample: Story = {
  args: {
    contexts: mockContexts,
    defaultValue: 'Morning meditation daily !Home #wellness',
  },
  parameters: {
    docs: {
      description: {
        story: 'Daily habit showing "daily" recurring pattern highlighted',
      },
    },
  },
};

export const ComplexParsing: Story = {
  args: {
    contexts: mockContexts,
    defaultValue: 'Review pull requests every 3 days !Coding #review #code p2 next monday',
  },
  parameters: {
    docs: {
      description: {
        story: 'Complex example with custom frequency (every 3 days), multiple tags, and relative date',
      },
    },
  },
};

export const LowPriorityTask: Story = {
  args: {
    contexts: mockContexts,
    defaultValue: 'Clean garage !Home p3 in 2 weeks',
  },
  parameters: {
    docs: {
      description: {
        story: 'Low priority task (p3) with relative date parsing',
      },
    },
  },
};
