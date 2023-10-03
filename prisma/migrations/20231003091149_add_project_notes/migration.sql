-- AlterTable
ALTER TABLE "project" RENAME COLUMN "updatedAt" to "updated_at";
ALTER TABLE "project" ADD COLUMN     "notes" TEXT;
