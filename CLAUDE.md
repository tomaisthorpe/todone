# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Unwhelm is a context-based task management application built with Next.js 15 (App Router), React 19 Server Components, TypeScript, PostgreSQL/Prisma, and NextAuth.js. It features customizable urgency scoring (inspired by TaskWarrior), flexible habit tracking with 4 distinct types, and natural language task parsing.

**Core Philosophy:** Prioritize user psychology over rigid productivity systems. Habits should feel supportive, not demanding. Context health gives a sense of life balance.

## Development Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production
npm run lint             # Run ESLint

# Testing
npm test                 # Run Jest tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Database
npm run db:push          # Push schema changes (development)
npm run db:migrate       # Run migrations (production)
npm run db:generate      # Generate Prisma client
npm run db:seed          # Seed with demo data
npm run db:studio        # Open Prisma Studio GUI
```

## Architecture

### Server-First Design

This codebase follows React/Next.js best practices with a server-first architecture:

- **Server Components by default** - Only use `"use client"` when absolutely necessary (interactive components, hooks, browser APIs)
- **Server Actions for mutations** - All data mutations go through Server Actions in `lib/server-actions.ts`
- **Server-side data fetching** - Data loading happens in `lib/data.ts` with `getServerSession`
- **Optimistic UI** - Interactive components use `useTransition` for immediate feedback while Server Actions execute

### Key Files

**Data Layer:**
- `lib/data.ts` - Server-side data fetching (getTasks, getContexts, getTags)
- `lib/server-actions.ts` - All mutations (create/update/delete tasks, contexts, tags)
- `lib/prisma.ts` - Singleton Prisma client
- `prisma/schema.prisma` - Database schema

**Business Logic:**
- `lib/utils.ts` - Urgency calculation (`evaluateUrgency`), utility functions
- `lib/urgency-config.ts` - Urgency scoring constants (priority, age, due date coefficients)
- `lib/habits.ts` - Habit-specific utilities (status calculation, streak tracking)
- `lib/task-completion-utils.ts` - Task completion logic for all task types
- `lib/date-utils.ts` - Date calculations respecting local calendar days
- `lib/email.ts` - Email service supporting Resend API and SMTP for self-hosting

**Client Components:**
- `components/dashboard-client.tsx` - Main client wrapper with optimistic UI
- `components/task-toggle-button.tsx` - Interactive task completion button
- `components/add-item-modal.tsx` - Task/context creation modal
- `app/page.tsx` - Main dashboard (Server Component that fetches data)

### Database Schema

**Core Models:**
- `Task` - All task types (regular, habit, recurring) with type discriminator
- `Context` - Task organization by location/situation (kitchen, coding, bathroom)
- `Tag` - Custom tags with urgency coefficients
- `HabitCompletion` - Historical habit completion tracking
- `User` - NextAuth.js user with credentials auth

**Task Types:**
1. `TASK` - Regular one-off tasks with due dates
2. `HABIT` - Recurring activities with flexible timing, streak tracking
3. `RECURRING` - Scheduled items with strict deadlines (meetings, bills)

**Habit Types:** `STREAK`, `LEARNING`, `WELLNESS`, `MAINTENANCE` (affects UI emphasis)

## Urgency System

The urgency calculation is in `lib/utils.ts:evaluateUrgency()`. It combines:

1. **Priority** - LOW/MEDIUM/HIGH with configurable coefficients
2. **Age** - How long the task has existed (older = more urgent)
3. **Due date proximity** - Exponential scaling as due date approaches, saturating for overdue
4. **Wait days** - Optional delay before urgency calculation starts (new feature)
5. **Project** - Fixed coefficient if project exists
6. **Tags** - Custom per-tag coefficients
7. **Context** - Custom per-context coefficients

Configuration lives in `lib/urgency-config.ts`. The system is designed to be transparent and customizable.

## Habit System

Habits use relaxed, non-judgmental language and have flexible timing:

**Status Language:**
- "✓ Fresh" - Recently completed, no action needed
- "⏰ Getting due" - Approaching usual frequency
- "⚡ Ready" - Available to do when convenient
- "🔄 Time for another" - Past usual frequency but not stressed

**Completion Logic:**
- Habits don't have "deadlines" - they have target frequencies
- Streaks track consecutive completions within frequency window
- `frequency` field is in days (1=daily, 7=weekly)
- Completion history stored in `HabitCompletion` table
- Logic in `lib/task-completion-utils.ts:completeTask()`

**Habit Types affect UI emphasis:**
- `STREAK` - Exercise, meditation (prominent streak display)
- `LEARNING` - Coding practice, reading (moderate emphasis)
- `WELLNESS` - Skincare, make bed (balanced)
- `MAINTENANCE` - Cleaning (de-emphasized, focus on "last done")

## Context Health

Context health is calculated based ONLY on habit completion (not regular tasks). It represents how well-maintained that area of life is. Calculation respects each habit's frequency and shows a percentage for each context.

## Natural Language Task Parsing

The `lib/utils.ts:parseTags()` function extracts:
- `!context` - Context name
- `#tag` - Tags
- `p1`/`p2`/`p3` - Priority (high/medium/low)
- Date expressions via `chrono-node` (tomorrow, next monday, 2024-12-25)

Used in the smart task input component.

## Code Style (from Cursor rules)

**TypeScript/React:**
- Functional and declarative patterns, avoid classes
- Descriptive variable names with auxiliary verbs (isLoading, hasError)
- Use Server Components by default, minimize `'use client'`
- Early returns for error conditions, guard clauses for validation
- Directory names: lowercase-with-dashes

**Tailwind CSS:**
- Use `bg-color/opacity` format (e.g., `bg-white/30`, `bg-red-300/10`)
- Never use `border` without a color, or omit it entirely
- Mobile-first responsive design

**Git Commits:**
- Use conventional commit format (feat:, fix:, docs:, etc.)

## Documentation Updates

When making significant changes, update these files in `/docs/`:
- `design-decisions.md` - Add new UX decisions or update reasoning
- `ui-patterns.md` - Update component patterns and examples

**Triggers for documentation updates:**
- Creating new component patterns
- Changing visual designs
- Making UX decisions
- Adding task/habit behaviors
- Modifying urgency calculation
- Changing context health system

## Testing

- Jest configuration in `jest.config.js`
- Unit tests in `lib/__tests__/` for utilities
- Test habit logic, urgency calculation, and date utilities
- Run tests before committing: `npm test`

## Authentication

NextAuth.js v4 with credentials provider:
- Configuration in `lib/auth.ts`
- Demo account (optional): demo@unwhelm.app / password123 (enabled via `ENABLE_DEMO_USER` flag)
- Passwords hashed with bcryptjs
- Session checking: `getServerSession(authOptions)`

## Common Patterns

**Server Action Pattern:**
```typescript
export async function myAction(data: FormData) {
  "use server";
  const userId = await getAuthenticatedUser(); // Handles redirect if not logged in
  // ... perform mutation
  revalidatePath("/"); // Revalidate cache
}
```

**Optimistic UI Pattern:**
```typescript
const [isPending, startTransition] = useTransition();

function handleToggle(taskId: string) {
  // Optimistic update
  setTasks(prev => prev.map(t =>
    t.id === taskId ? {...t, completed: !t.completed} : t
  ));

  startTransition(async () => {
    await toggleTaskAction(taskId);
  });
}
```

**Data Fetching Pattern:**
```typescript
// In Server Component (app/page.tsx)
const tasks = await getTasks();
const contexts = await getContexts();
return <DashboardClient tasks={tasks} contexts={contexts} />;
```

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/unwhelm"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email Configuration (required for email features)
EMAIL_PROVIDER="resend"  # Options: "resend" or "smtp"
EMAIL_FROM="noreply@yourdomain.com"

# For Resend (if EMAIL_PROVIDER="resend")
RESEND_API_KEY="re_123456789"

# For SMTP (if EMAIL_PROVIDER="smtp")
SMTP_HOST="smtp.yourmailserver.com"
SMTP_PORT="587"  # Default: 587 (or 465 for SSL)
SMTP_USER="your-smtp-username"
SMTP_PASS="your-smtp-password"
SMTP_SECURE="false"  # Optional: "true" for SSL/TLS (default: false for 587, true for 465)

# Demo User Feature Flag
ENABLE_DEMO_USER="true"  # Set to "true" to create demo user during seed (default: false)
NEXT_PUBLIC_ENABLE_DEMO_USER="true"  # Set to "true" to show demo credentials on login form (default: false)
```

## Important Notes

- Context health calculation excludes regular tasks (habits only)
- Never use deadline language for habits
- Urgency scoring should be transparent (provide explanations)
- Tasks are sorted by urgency, completed items at bottom
- The "Today" section shows ALL tasks due today from any context
- `waitDays` feature allows delaying urgency increases until N days before due date
- Always use `diffInLocalCalendarDays` from `date-utils.ts` for calendar day calculations (respects local timezone, not UTC)
