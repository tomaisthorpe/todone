# Todone

A context-based task management app with customizable urgency scoring and flexible habit tracking.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Core Concept

Todone is designed to solve the problem of prioritizing work across multiple projects and life areas. Unlike traditional task apps, it uses:

- **Context-based organization** (coding, bathroom, kitchen, etc.)
- **Customizable urgency scoring** (inspired by TaskWarrior)
- **Flexible habit tracking** with different types
- **Text-based task entry** (like Todoist)

## Key Features

### Task Types

1. **Regular Tasks** - One-off items with due dates and urgency scores
2. **Habits** - Recurring activities with flexible timing and streak tracking
3. **Recurring Tasks** - Scheduled items with strict deadlines (meetings, etc.)

### Habit Types

Different habit types have different UI emphasis:

- **Streak Habits** (exercise, meditation) - Prominent streak display with personal bests
- **Learning Habits** (coding practice, reading) - Moderate streak emphasis
- **Wellness Habits** (skincare, make bed) - Balanced streak and frequency
- **Maintenance Habits** (cleaning) - De-emphasized streaks, focus on "last done"

### Context Health

Each context shows a "health" percentage based only on habit completion (not regular tasks). This represents how well-maintained that area of life is.

### Urgency System

Tasks are sorted by urgency scores (0-10) that can be customized based on:
- Project importance
- Age of task
- Priority level
- Tags
- Due date proximity

## UI Structure

```
Today Section
├── All tasks due today (from any context)
└── Sorted by urgency

Contexts (collapsible)
├── Context health bar (habits only)
├── Unified task list (habits + tasks + recurring)
└── Sorted by urgency, completed items at bottom
```

## Habit Status Language

Habits use relaxed, non-judgmental language:
- **"✓ Fresh"** - Recently completed, no action needed
- **"⏰ Getting due"** - Approaching usual frequency
- **"⚡ Ready"** - Available to do when convenient
- **"🔄 Time for another"** - Past usual frequency but not stressed

## Technical Stack

- **Frontend**: Next.js with React
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data**: Local state (will expand to persistence layer)

## Design Principles

1. **Habits ≠ Deadlines** - Habits are flexible and forgiving, not rigid schedules
2. **Context Matters** - Tasks are organized by where/when they're done
3. **Urgency > Priority** - Mathematical urgency scoring beats arbitrary priorities
4. **Text-First Entry** - Quick, natural language task creation
5. **Visual Scanning** - Important information is immediately visible

## Planned Features

### Phase 1 (MVP)
- [ ] Basic task CRUD
- [ ] Context management
- [ ] Urgency calculation
- [ ] Habit tracking
- [ ] Local storage persistence

### Phase 2 (Enhanced)
- [ ] Text-based task entry with parsing
- [ ] Customizable urgency weightings
- [ ] Task templates
- [ ] Basic reporting/analytics

### Phase 3 (Advanced)
- [ ] Shared contexts (family/roommates)
- [ ] Hardware displays for context reminders
- [ ] Mobile app
- [ ] Sync across devices

## Development Guidelines

### State Management
- Keep task data structure flexible for different types
- Separate context health calculation (habits only)
- Maintain urgency scoring as a pure function

### UI Components
- TaskCard component handles all task types
- ContextGroup manages collapse/expand state
- Clear visual hierarchy: habits with icons, recurring with rotate icon

### Habit System
- Frequency in days (1 = daily, 7 = weekly)
- Track streak, longest streak, last completed
- Status calculation based on frequency vs. days since completion
- Never use deadline language for habits

## File Structure Suggestions

```
src/
├── components/
│   ├── TaskCard.jsx
│   ├── ContextGroup.jsx
│   ├── TodaySection.jsx
│   └── TaskEntry.jsx
├── lib/
│   ├── urgency.js
│   ├── habits.js
│   └── storage.js
├── hooks/
│   ├── useTasks.js
│   └── useContexts.js
└── app/
    └── page.tsx
```

## Data Schema

### Task Object
```javascript
{
  id: string,
  title: string,
  project: string,
  priority: 'low' | 'medium' | 'high',
  tags: string[],
  context: string,
  dueDate: string | null,
  urgency: number,
  completed: boolean,
  type: 'task' | 'habit' | 'recurring',
  
  // Habit-specific fields
  habitType?: 'streak' | 'learning' | 'wellness' | 'maintenance',
  streak?: number,
  longestStreak?: number,
  frequency?: number, // days
  lastCompleted?: string,
  
  // Recurring-specific fields
  nextDue?: string
}
```

### Context Object
```javascript
{
  id: string,
  name: string,
  description: string,
  icon: string, // Lucide icon name
  color: string, // Tailwind bg class
  shared?: boolean // Future feature
}
```

## Notes for LLM Development

- The app prioritizes user psychology over rigid productivity systems
- Habits should feel supportive, not demanding
- Context health gives a sense of life balance
- Urgency scoring should be transparent and customizable
- Text entry should parse natural language patterns
- UI should minimize cognitive load while maximizing useful information

The goal is to create a tool that helps users maintain both productivity and well-being across different areas of life, with particular attention to making habit formation sustainable and stress-free.

## Next.js Resources

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.