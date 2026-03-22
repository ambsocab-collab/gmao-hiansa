-- AlterTable
ALTER TABLE "failureReports" ADD COLUMN "tipo" TEXT NOT NULL DEFAULT 'avería';

-- DropIndex
DROP INDEX IF EXISTS "failureReports_idx";