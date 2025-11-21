import type { Meta, StoryObj } from '@storybook/react';
import { TaskToggleButton } from './task-toggle-button';

const meta: Meta<typeof TaskToggleButton> = {
  title: 'Components/TaskToggleButton',
  component: TaskToggleButton,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    completed: {
      control: 'boolean',
      description: 'Whether the task is completed',
    },
    taskId: {
      control: 'text',
      description: 'The ID of the task',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TaskToggleButton>;

export const Uncompleted: Story = {
  args: {
    taskId: '1',
    completed: false,
  },
};

export const Completed: Story = {
  args: {
    taskId: '1',
    completed: true,
  },
};

export const Interactive: Story = {
  args: {
    taskId: '1',
    completed: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Click the button to toggle completion state (requires running app)',
      },
    },
  },
};
