# unwhelm Setup Guide

## Overview

This is the full-stack version of unwhelm, a context-based task management app with customizable urgency scoring and flexible habit tracking. The application has been built according to the specifications in the README.md and design documents, **utilizing React Server Components and Server Actions for optimal performance**.

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19 Server Components, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v4 with credentials provider
- **Styling**: Tailwind CSS + shadcn/ui components
- **Data**: Server-side data fetching with Server Actions
- **Icons**: Lucide React
- **Forms**: Server Actions with native form handling

## Architecture Highlights

✅ **Server-First Approach**: Follows React best practices by using Server Components wherever possible  
✅ **Server Actions**: All mutations handled server-side for better performance and security  
✅ **Minimal Client JavaScript**: Interactive components use `"use client"` while maintaining server-first approach  
✅ **Optimistic UI**: Task toggling with `useTransition` for immediate feedback  
✅ **Type Safety**: Full TypeScript coverage from database to UI

## Setup Instructions

### 1. Prerequisites

Make sure you have the following installed:

- Node.js 18 or later
- PostgreSQL database (local or cloud)
- npm or yarn package manager

### 2. Environment Configuration

1. Copy the `.env` file and update the database connection:

   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/unwhelm?schema=public"
   NEXTAUTH_SECRET="your-secure-random-string-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

2. **For local PostgreSQL setup:**
   - Install PostgreSQL locally
   - Create a database named `unwhelm`
   - Update the `DATABASE_URL` with your credentials

3. **For cloud PostgreSQL (recommended):**
   - Use services like Neon, Supabase, or Railway
   - Get the connection string and update `DATABASE_URL`

### 3. Installation and Database Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Generate Prisma client:**

   ```bash
   npm run db:generate
   ```

3. **Push the database schema:**

   ```bash
   npm run db:push
   ```

4. **Seed the database with sample data:**
   ```bash
   npm run db:seed
   ```

### 4. Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Demo Account

The application comes with a pre-seeded demo account for immediate testing:

- **Email**: `demo@unwhelm.app`
- **Password**: `password123`

This account includes sample contexts and tasks that demonstrate all features including different task types, habit tracking, and context health visualization.

## Application Features

### ✅ Implemented Features

1. **Server-Side Architecture**
   - React Server Components for optimal performance
   - Server Actions for all data mutations
   - Minimal client-side JavaScript
   - Server-side data fetching and rendering

2. **Authentication System**
   - Secure login/logout with NextAuth.js
   - Password hashing with bcryptjs
   - Server-side session checking and protection

3. **Database Schema**
   - Users, contexts, tasks, and habit completions
   - Proper relationships and constraints
   - User data isolation and security

4. **Core Components**
   - TaskCard: Client Component with interactive task management
   - ContextGroup: Server Component with collapsible client behavior
   - TodaySection: Server Component for today's tasks
   - TaskToggleButton: Client Component for optimistic task completion
   - Responsive design with mobile support

5. **Task Management**
   - Server Actions for create, update, delete operations
   - Three task types: regular, habits, recurring
   - Urgency calculation on server-side
   - Optimistic UI updates with `useTransition`

6. **Habit Tracking**
   - Four habit types with different visual emphasis
   - Flexible frequency settings (daily, weekly, etc.)
   - Streak tracking and completion history
   - Relaxed, supportive status language

7. **Context Health System**
   - Health percentage based only on habits
   - Visual health bars and indicators
   - Client-side collapsible functionality

8. **Data Persistence**
   - PostgreSQL database with Prisma ORM
   - Server Actions for all CRUD operations
   - Automatic page revalidation after mutations

### 🔄 Server Actions

- `toggleTaskAction(taskId)` - Toggle task completion with habit tracking
- `createTaskAction(formData)` - Create new tasks from form data
- `createContextAction(formData)` - Create new contexts
- `deleteTaskAction(taskId)` - Delete tasks securely

### 🎨 UI/UX Features

- Follows the exact design from `docs/mockup.tsx`
- Shadcn/ui components for consistency
- Proper color coding for urgency levels
- Habit icons and status badges
- Responsive grid layout
- Server-rendered with minimal client JavaScript

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

## File Structure

```
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (legacy, now using Server Actions)
│   ├── auth/signin/              # Authentication pages
│   ├── globals.css               # Global styles with shadcn/ui
│   ├── layout.tsx                # Root layout with minimal providers
│   └── page.tsx                  # Main dashboard (Server Component)
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── task-card.tsx             # Server Component for task display
│   ├── task-toggle-button.tsx    # Client Component for task interaction
│   ├── context-group.tsx         # Server Component for context management
│   ├── context-collapsible.tsx   # Client Component for collapse behavior
│   ├── today-section.tsx         # Server Component for today's tasks
│   └── providers.tsx             # Minimal providers (SessionProvider only)
├── lib/                          # Utility functions
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client instance
│   ├── server-actions.ts         # Server Actions for mutations
│   ├── data.ts                   # Server-side data fetching functions
│   ├── utils.ts                  # General utilities + urgency calculation
│   └── habits.ts                 # Habit-specific utilities
├── prisma/                       # Database schema and migrations
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Sample data seeding
├── types/                        # TypeScript type definitions
│   └── next-auth.d.ts            # NextAuth type extensions
└── docs/                         # Documentation
    ├── design-decisions.md       # Design philosophy
    ├── ui-patterns.md            # Component patterns
    └── mockup.tsx                # Original design mockup
```

## Server vs Client Components

### Server Components (no "use client")

- `app/page.tsx` - Main dashboard with server-side data fetching
- `components/today-section.tsx` - Today's tasks (static rendering)
- `components/context-group.tsx` - Context display (static rendering)

### Client Components ("use client")

- `components/task-card.tsx` - Task display with interactive elements
- `components/task-toggle-button.tsx` - Task completion interaction
- `components/context-collapsible.tsx` - Context collapse/expand
- `components/add-item-modal.tsx` - Task/context creation modal
- `components/providers.tsx` - SessionProvider wrapper
- `app/auth/signin/page.tsx` - Authentication form
- `components/ui/*` - shadcn/ui interactive components

## Key Design Decisions

1. **Server-First Architecture**: Maximize use of React Server Components
2. **Server Actions**: All mutations handled server-side for security and performance
3. **Minimal Client JS**: Only interactive elements require client-side code
4. **Optimistic Updates**: Immediate UI feedback with `useTransition`
5. **Type Safety**: End-to-end TypeScript from database to UI

## Performance Benefits

- **Reduced Bundle Size**: Most components render on server
- **Better SEO**: Server-rendered content
- **Faster Initial Load**: Less JavaScript to download
- **Better UX**: Optimistic updates for interactions
- **Improved Security**: Sensitive operations on server

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Ensure your PostgreSQL server is running
- Check firewall settings for cloud databases

### Authentication Issues

- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies if needed

### Build Issues

- Run `npm run db:generate` after schema changes
- Ensure all environment variables are set
- Check TypeScript errors with `npm run lint`

## Next Steps

The application follows React best practices with a server-first approach. For future enhancements, consider:

1. **Text-based task entry** with Server Actions form handling
2. **Shared contexts** for family/roommate collaboration
3. **Progressive enhancement** for better offline experience
4. **Advanced analytics** with server-side computation
5. **Real-time updates** using Server Actions with WebSocket fallback

## Support

For questions or issues:

1. Check the documentation in `/docs/`
2. Review the server-side data flow
3. Check the console for error messages
4. Verify database connectivity and seeding

The application follows React Server Component best practices and provides excellent performance with minimal client-side JavaScript while maintaining full functionality.

