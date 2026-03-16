# Database Migrations Guide

## Overview

This project uses **Prisma Migrate** to manage database schema changes. When you deploy to Vercel, migrations run automatically.

## How it Works

### Development Workflow

1. **Make schema changes** in `prisma/schema.prisma`

2. **Create a migration** (development only):
   ```bash
   npx prisma migrate dev --name describe_your_changes
   ```
   This creates:
   - A new migration file in `prisma/migrations/`
   - Runs the migration against your dev database
   - Regenerates Prisma Client

3. **Test locally**:
   ```bash
   npm run dev
   ```

### Production Deployment (Vercel)

When you push to `main` branch, Vercel automatically:

1. Runs `npx prisma migrate deploy`
   - Executes **only new migrations** not yet applied
   - Safe for existing data
   - Skips already-applied migrations

2. Runs `npx prisma generate`
   - Generates Prisma Client with updated types

3. Runs `npm run build`
   - Builds your Next.js application

## Available Scripts

| Command | Description | Environment |
|---------|-------------|-------------|
| `npm run db:generate` | Generate Prisma Client | Local |
| `npm run db:push` | Push schema changes without migration (dev only) | Local |
| `npm run db:migrate:prod` | Deploy pending migrations | Production |
| `npm run db:seed` | Seed database with initial data | Local |
| `npm run db:studio` | Open Prisma Studio UI | Local |

## Migration Best Practices

### ✅ DO

- **Always use `prisma migrate dev` in development**
- **Write descriptive migration names**: `add_user_avatar_field`, `create_tags_table`
- **Review migration files** before committing
- **Test migrations locally** before deploying
- **Keep migrations reversible** when possible

### ❌ DON'T

- **Never use `prisma db push` in production**
- **Never manually edit migration files** once created
- **Never rename tables/columns** in single migration (use multi-step approach)
- **Never delete migration files** that were already deployed

## Example Workflow

### Adding a New Field

```bash
# 1. Edit schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_user_last_login

# 3. Test locally
npm run dev

# 4. Commit and push
git add .
git commit -m "feat: add user last login field"
git push origin main

# 5. Vercel automatically runs migration on deploy
```

### Creating a New Table

```bash
# 1. Edit schema.prisma with new model
# 2. Create migration
npx prisma migrate dev --name create_audit_logs_table

# 3. Test locally
npm run db:seed  # If needed

# 4. Deploy
git push origin main
```

## Troubleshooting

### Migration Conflicts

If two developers create migrations with same number:

```bash
# Rename your migration to next available number
# Rename: 20240101000000_add_field
# To:     20240101000001_add_field
```

### Rollback a Migration

```bash
# Dev environment
npx prisma migrate resolve --rolled-back "migration_name"

# Then fix your schema and create new migration
npx prisma migrate dev --name fix_previous_migration
```

### Check Migration Status

```bash
# Local
npx prisma migrate status

# Production (requires DATABASE_URL)
DATABASE_URL="your_prod_url" npx prisma migrate status
```

## Production Environment Variables

Ensure these are set in Vercel:

- `DATABASE_URL` - Your production database connection string
- `DIRECT_URL` - (Optional) Direct URL for migrations

**⚠️ NEVER commit production `.env` files to git!**

## Deployment Safety

The `prisma migrate deploy` command used in Vercel:

- ✅ Only runs **new** migrations
- ✅ Tracks applied migrations in `_prisma_migrations` table
- ✅ Prevents concurrent migrations
- ✅ Shows clear error messages on failure
- ✅ Supports zero-downtime deployments

## Seeding Production

Production database is seeded on first deploy via `prisma/seed.ts`.

**⚠️ WARNING**: The seed script **cleans existing data**. Only run in empty databases or development.

To re-seed production (rare, dangerous):

```bash
# Only do this if you know what you're doing!
DATABASE_URL="your_prod_url" npx prisma db seed
```

## Additional Resources

- [Prisma Migrate Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Migration Files](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#migration-files)
- [Vercel Integration](https://vercel.com/docs/concepts/deployments/ignored-build-step)
