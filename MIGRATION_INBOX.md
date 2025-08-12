# Inbox Context Migration Guide

This guide explains how to migrate your existing Todone application to support the new default 'Inbox' context feature.

## What's New

- **Default Inbox Context**: Every user now has a default 'Inbox' context that automatically receives tasks when no specific context is selected
- **Automatic Fallback**: Tasks created without a context are automatically assigned to the user's Inbox
- **Protected Context**: Inbox contexts cannot be renamed or archived
- **Seamless Experience**: No more "context required" errors - tasks flow naturally into the Inbox

## Migration Steps

### 1. Database Schema Update

The database schema has been updated to include an `isInbox` boolean field in the `Context` model.

```sql
-- This migration will be automatically generated when you run:
npx prisma migrate dev --name add-inbox-context
```

### 2. Existing Users Migration

Run the migration script to create Inbox contexts for all existing users:

```bash
# Compile and run the migration script
npx ts-node scripts/migrate-inbox-contexts.ts
```

This script will:
- Find all users who don't have an Inbox context
- Create a new Inbox context for each user
- Use consistent styling (blue color, Inbox icon)
- Skip users who already have an Inbox context

### 3. Seed Data Update

The seed script has been updated to automatically create an Inbox context for the demo user. Future seeds will include the Inbox context by default.

### 4. New User Signup

New users who sign up will automatically get an Inbox context created during the registration process.

## Features

### User Experience
- **Simplified Task Creation**: Users can create tasks without selecting a context
- **Smart Defaults**: Task forms default to Inbox context when none is selected
- **Clear Visual Indicators**: Inbox context is marked as "(default)" in dropdowns
- **Organized Display**: Inbox context appears first in context lists

### Protection Mechanisms
- **Cannot Rename**: Inbox context name is protected from modification
- **Cannot Archive**: Inbox context cannot be archived
- **UI Restrictions**: Edit buttons are hidden for Inbox contexts
- **Server Validation**: Backend prevents modification of Inbox contexts

### Task Flow
- Tasks without a context → Automatically assigned to Inbox
- Tasks with a context → Work as before
- Context selection → Optional (fallback to Inbox)
- Form validation → No longer requires context selection

## Technical Changes

### Database
- Added `isInbox` boolean field to `Context` model
- Updated TypeScript interfaces to include `isInbox` property

### Server Actions
- `createTaskAction`: Auto-assigns Inbox when no context provided
- `updateContextAction`: Prevents modification of Inbox contexts
- `archiveContextAction`: Prevents archiving of Inbox contexts
- `createInboxContext`: Helper function for Inbox creation
- `getOrCreateInboxContext`: Ensures user has an Inbox context

### UI Components
- **TaskForm**: Shows Inbox as default, sorts Inbox first
- **SmartTaskInput**: Removes context requirement validation
- **AddItemModal**: Disables editing for Inbox contexts
- **ContextGroup**: Hides edit button for Inbox contexts

### User Management
- **Signup API**: Automatically creates Inbox context for new users
- **Migration Script**: Adds Inbox contexts to existing users

## Color Scheme

The Inbox context uses `bg-blue-500` (blue) as the primary color, matching the app's design system.

## Rollback

If you need to rollback this feature:

1. Remove tasks from Inbox contexts or reassign them
2. Delete Inbox contexts from the database
3. Revert the schema changes
4. Restore the original validation logic

## Testing

After migration, verify:
- [ ] New users get an Inbox context on signup
- [ ] Existing users have an Inbox context after migration
- [ ] Tasks without context go to Inbox automatically
- [ ] Inbox context cannot be renamed or archived
- [ ] UI shows Inbox as default option
- [ ] Context selection is optional in task forms

## Support

If you encounter issues during migration:
1. Check the migration script logs for errors
2. Verify database connectivity
3. Ensure all TypeScript types are updated
4. Run `npx tsc --noEmit` to check for type errors

## Files Changed

- `prisma/schema.prisma`: Added `isInbox` field
- `lib/server-actions.ts`: Added Inbox helpers and protection
- `app/api/auth/signup/route.ts`: Auto-create Inbox on signup
- `lib/data.ts`: Updated Context interface
- `lib/context-icons.ts`: Added Inbox icon
- Components: Updated all context-related components
- `scripts/migrate-inbox-contexts.ts`: Migration script
- `prisma/seed.ts`: Include Inbox in seed data