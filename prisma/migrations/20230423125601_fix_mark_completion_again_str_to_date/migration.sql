/*
  Warnings:

  - The `markedCompletions` column on the `exercise_event` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "exercise_event" DROP COLUMN "markedCompletions",
ADD COLUMN     "markedCompletions" TIMESTAMP(3)[];
