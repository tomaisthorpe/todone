# Migration Instructions

The schema has been updated with `role` and `plan` fields on the User model.
Due to network restrictions in the CI environment, you need to apply these changes locally.

## Steps to Apply

1. **Apply the database migration:**
   ```bash
   npm run db:migrate
   # OR if using db:push for development
   npm run db:push
   ```

2. **Generate the Prisma client:**
   ```bash
   npm run db:generate
   ```

3. **Verify the build:**
   ```bash
   npm run build
   ```

## What Changed

- Added `UserPlan` enum (FREE, PRO)
- Added `UserRole` enum (USER, ADMIN)
- Added `plan` field to User model (defaults to FREE)
- Added `role` field to User model (defaults to USER)

The migration file is located at:
`prisma/migrations/20251109144643_add_user_plans/migration.sql`
