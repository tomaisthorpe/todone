# Storybook Setup

This project uses Storybook to develop and showcase UI components in isolation.

## Running Storybook

```bash
npm run storybook
```

This will start the Storybook development server on `http://localhost:6006/`.

## Building Storybook

```bash
npm run build-storybook
```

This creates a static build of Storybook in the `storybook-static` directory.

## Available Stories

### TaskCard (`components/task-card.stories.tsx`)

The TaskCard component displays task information with various states:

- **Default** - Standard task with medium priority
- **HighPriority** - Task with high priority and urgency
- **LowPriority** - Task with low priority
- **Completed** - Completed task showing strikethrough
- **Overdue** - Overdue task with high urgency
- **HabitStreak** - Daily habit with streak tracking
- **HabitLearning** - Learning habit type
- **RecurringTask** - Weekly recurring task
- **WithSubtasks** - Task with multiple subtasks and progress
- **WithSearchHighlight** - Task with search term highlighting
- **LongTitle** - Task with very long title to test wrapping

### TaskToggleButton (`components/task-toggle-button.stories.tsx`)

Simple button component for toggling task completion:

- **Uncompleted** - Empty circle icon
- **Completed** - Checked circle icon

### SmartTaskInput (`components/smart-task-input.stories.tsx`)

Natural language task input with parsing:

- **Default** - Basic input with multiple contexts
- **WithMultipleContexts** - Example with context, tags, priority, and date
- **RecurringTaskExample** - Example of recurring task syntax
- **ComplexTaskExample** - Complex task with multiple attributes
- **DailyHabitExample** - Daily habit creation example

## Creating New Stories

Stories are located in `components/*.stories.tsx` files. The Storybook configuration in `.storybook/main.ts` is set to automatically discover all `*.stories.tsx` files in the `components` directory.

### Example Story Structure

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './your-component';

const meta: Meta<typeof YourComponent> = {
  title: 'Components/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof YourComponent>;

export const Default: Story = {
  args: {
    // Your component props here
  },
};
```

## Configuration

- **`.storybook/main.ts`** - Main Storybook configuration
- **`.storybook/preview.ts`** - Global decorators and parameters
  - Imports `app/globals.css` for Tailwind CSS support

## Tips

1. Use the Controls panel to interactively change component props
2. Use the Actions panel to see events fired by components
3. Use the Docs tab to view auto-generated documentation
4. Stories support Next.js features through `@storybook/nextjs`
