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
  },
};

export const WithMultipleContexts: Story = {
  args: {
    contexts: mockContexts,
  },
  parameters: {
    docs: {
      description: {
        story: 'Try typing: "Setup unwhelm !Coding #sideprojects p1 tomorrow"',
      },
    },
  },
};

export const RecurringTaskExample: Story = {
  args: {
    contexts: mockContexts,
  },
  parameters: {
    docs: {
      description: {
        story: 'Try typing: "Team standup meeting every week !Work #meetings p2"',
      },
    },
  },
};

export const WithContextSuggestions: Story = {
  args: {
    contexts: mockContexts,
  },
  parameters: {
    docs: {
      description: {
        story: 'Type "!" to see context suggestions',
      },
    },
  },
};

export const WithTagSuggestions: Story = {
  args: {
    contexts: mockContexts,
  },
  parameters: {
    docs: {
      description: {
        story: 'Type "#" to see tag suggestions',
      },
    },
  },
};

export const ComplexTaskExample: Story = {
  args: {
    contexts: mockContexts,
  },
  parameters: {
    docs: {
      description: {
        story: 'Example: "Fix critical bug in authentication system !Work #urgent #bug p1 today"',
      },
    },
  },
};

export const DailyHabitExample: Story = {
  args: {
    contexts: mockContexts,
  },
  parameters: {
    docs: {
      description: {
        story: 'Example: "Morning meditation daily !Home #wellness"',
      },
    },
  },
};
