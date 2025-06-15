# Todone Setup Guide

## Overview

This is the full-stack version of Todone, a context-based task management app with customizable urgency scoring and flexible habit tracking. The application has been built according to the specifications in the README.md and design documents.

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v4 with credentials provider
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

## Setup Instructions

### 1. Prerequisites

Make sure you have the following installed:
- Node.js 18 or later
- PostgreSQL database (local or cloud)
- npm or yarn package manager

### 2. Environment Configuration

1. Copy the `.env` file and update the database connection:
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/todone?schema=public"
   NEXTAUTH_SECRET="your-secure-random-string-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

2. **For local PostgreSQL setup:**
   - Install PostgreSQL locally
   - Create a database named `todone`
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

The application comes with a pre-seeded demo account:
- **Email**: `demo@todone.app`
- **Password**: `password123`

This account includes sample contexts and tasks that match the design mockup.

## Application Features

### ✅ Implemented Features

1. **Authentication System**
   - Secure login/logout with NextAuth.js
   - Password hashing with bcryptjs
   - Protected routes and session management

2. **Database Schema**
   - Users, contexts, tasks, and habit completions
   - Proper relationships and constraints
   - User data isolation and security

3. **Core Components**
   - TaskCard: Handles all task types with visual distinctions
   - ContextGroup: Collapsible contexts with health bars
   - TodaySection: Shows all tasks due today
   - Responsive design with mobile support

4. **Task Management**
   - Create, read, update, delete tasks
   - Three task types: regular, habits, recurring
   - Urgency calculation based on multiple factors
   - Real-time updates with optimistic UI

5. **Habit Tracking**
   - Four habit types with different visual emphasis
   - Flexible frequency settings (daily, weekly, etc.)
   - Streak tracking and completion history
   - Relaxed, supportive status language

6. **Context Health System**
   - Health percentage based only on habits
   - Visual health bars and indicators
   - Context collapse/expand functionality

7. **Data Persistence**
   - PostgreSQL database with Prisma ORM
   - API routes for all CRUD operations
   - Error handling and loading states

### 🔄 API Endpoints

- `GET/POST /api/tasks` - List and create tasks
- `GET/PUT/DELETE /api/tasks/[id]` - Individual task operations
- `GET/POST /api/contexts` - List and create contexts
- `POST /api/auth/[...nextauth]` - Authentication endpoints

### 🎨 UI/UX Features

- Follows the exact design from `docs/mockup.tsx`
- Shadcn/ui components for consistency
- Proper color coding for urgency levels
- Habit icons and status badges
- Responsive grid layout
- Loading and error states

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
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/   # NextAuth configuration
│   │   ├── tasks/                # Task CRUD operations
│   │   └── contexts/             # Context CRUD operations
│   ├── auth/signin/              # Authentication pages
│   ├── globals.css               # Global styles with shadcn/ui
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Main dashboard page
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── task-card.tsx             # Task display component
│   ├── context-group.tsx         # Context management component
│   ├── today-section.tsx         # Today's tasks section
│   └── providers.tsx             # Query and auth providers
├── hooks/                        # React Query hooks
│   ├── use-tasks.ts              # Task management hooks
│   └── use-contexts.ts           # Context management hooks
├── lib/                          # Utility functions
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client instance
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

## Key Design Decisions

1. **Habits ≠ Tasks**: Habits use supportive language and flexible timing
2. **Context-Based Organization**: Tasks organized by where/when they're done
3. **Urgency Over Priority**: Mathematical urgency calculation
4. **Unified Task Lists**: All task types in the same list, sorted by urgency
5. **Context Health from Habits Only**: One-off tasks don't affect context health

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

The application is fully functional with all core features implemented. For future enhancements, consider:

1. **Text-based task entry** with natural language parsing
2. **Shared contexts** for family/roommate collaboration
3. **Mobile app** version
4. **Advanced analytics** and reporting
5. **Customizable urgency weights**
6. **Task templates** and automation

## Support

For questions or issues:
1. Check the documentation in `/docs/`
2. Review the original design decisions
3. Check the console for error messages
4. Verify database connectivity and seeding

The application follows the exact specifications from the design documentation and provides a solid foundation for a production-ready task management system.