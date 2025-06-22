# Todone

A context-based task management app with customizable urgency scoring and flexible habit tracking.

## Overview

This is the **full-stack version** of Todone, utilizing React Server Components and Server Actions for optimal performance. The application has been built according to the specifications in the design documents with a server-first architecture.

## Quick Start

For detailed setup instructions, see [SETUP.md](./SETUP.md).

**Demo Account:**
- Email: `demo@todone.app` 
- Password: `password123`

**Development:**
```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

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

- **Frontend**: Next.js 15 with App Router, React 19 Server Components, TypeScript
- **Database**: PostgreSQL with Prisma ORM  
- **Authentication**: NextAuth.js v4 with credentials provider
- **Styling**: Tailwind CSS + shadcn/ui components
- **Data**: Server-side data fetching with Server Actions
- **Icons**: Lucide React
- **Forms**: Server Actions with native form handling

### UI Component Strategy

We use **shadcn/ui** for foundational components and build custom components for Todone-specific patterns:

**shadcn/ui components:**
- Basic building blocks: Button, Card, Badge, Dialog, Input
- Standard patterns: Loading states, form components, modals

**Custom components:**
- TaskCard (handles 3 task types with different visual treatments)
- ContextGroup (collapse/expand with health visualization)
- HabitStatusBadge (relaxed status language with emojis)
- UrgencyScore (mathematical scoring display)

This approach gives us speed for common patterns while maintaining full control over the unique Todone UX that differentiates it from other task apps.

## Design Principles

1. **Habits ≠ Deadlines** - Habits are flexible and forgiving, not rigid schedules
2. **Context Matters** - Tasks are organized by where/when they're done
3. **Urgency > Priority** - Mathematical urgency scoring beats arbitrary priorities
4. **Text-First Entry** - Quick, natural language task creation
5. **Visual Scanning** - Important information is immediately visible

## Features 

**Core Functionality:**
- ✅ Complete task CRUD with Server Actions
- ✅ Context management with health tracking
- ✅ Dynamic urgency calculation
- ✅ Full habit tracking system with 4 habit types
- ✅ PostgreSQL database with Prisma ORM
- ✅ User authentication with NextAuth.js
- ✅ Server-side rendering and data fetching

**Task Management:**
- ✅ Three task types: regular, habits, recurring
- ✅ Urgency scoring based on priority, age, due dates, tags
- ✅ Optimistic UI updates with Server Actions
- ✅ Task completion with habit streak tracking

**UI/UX:**
- ✅ Responsive design with Tailwind CSS + shadcn/ui
- ✅ Context health visualization
- ✅ Collapsible context groups
- ✅ Today section for due tasks
- ✅ Relaxed habit status language

### 🔄 Future Enhancements
- Text-based task entry with natural language parsing
- Customizable urgency weightings
- Shared contexts for families/roommates  
- Mobile app and sync across devices
- Advanced analytics and reporting

## Design Reference

The current UI mockup can be found in `/docs/mockup.tsx`. This represents the target design and includes:

- Complete task management interface
- All task types (regular, habits, recurring)
- Context organization with health bars
- Habit status language and visual hierarchy
- Collapsible contexts with unified task lists

Use this mockup as a reference for component structure, styling patterns, and user interaction flows.

## Documentation Maintenance

When making significant changes to the UI or design decisions, please update:
- `/docs/design-decisions.md` - Add new decisions or update reasoning
- `/docs/ui-patterns.md` - Update component patterns and examples
- `/docs/mockup.tsx` - Update if UI significantly changes

This helps maintain context for future development and AI assistance.

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

## Architecture Highlights

✅ **Server-First Approach**: Follows React best practices by using Server Components wherever possible  
✅ **Server Actions**: All mutations handled server-side for better performance and security  
✅ **Minimal Client JavaScript**: Only interactive components use `"use client"`  
✅ **Optimistic UI**: Task toggling with `useTransition` for immediate feedback  
✅ **Type Safety**: Full TypeScript coverage from database to UI  

## File Structure

```
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (legacy)
│   ├── auth/signin/              # Authentication pages  
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Main dashboard (Server Component)
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── task-card.tsx             # Task display component
│   ├── task-toggle-button.tsx    # Client Component for task interaction
│   ├── context-group.tsx         # Context management component
│   ├── today-section.tsx         # Today's tasks component
│   └── add-item-modal.tsx        # Task/context creation modal
├── lib/                          # Utility functions
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client instance
│   ├── server-actions.ts         # Server Actions for mutations
│   ├── data.ts                   # Server-side data fetching
│   ├── utils.ts                  # Utilities + urgency calculation
│   └── habits.ts                 # Habit-specific utilities
├── prisma/                       # Database schema
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Sample data seeding
└── docs/                         # Documentation
    ├── design-decisions.md       # Design philosophy
    └── ui-patterns.md            # Component patterns
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

## Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npm run db:push         # Push schema changes to database
npm run db:seed         # Seed database with sample data
npm run db:migrate      # Run database migrations
npm run db:generate     # Generate Prisma client
npm run db:studio       # Open Prisma Studio
```