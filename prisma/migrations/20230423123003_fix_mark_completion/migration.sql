/*
  Warnings:

  - You are about to drop the column `is_marked_completed` on the `exercise_event` table. All the data in the column will be lost.
  - You are about to drop the column `marked_completed_on` on the `exercise_event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "exercise_event" DROP COLUMN "is_marked_completed",
DROP COLUMN "marked_completed_on",
ADD COLUMN     "markedCompletions" TIMESTAMP(3)[];

-- CreateTable
CREATE TABLE "exercise_event_completion" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_event_completion_pkey" PRIMARY KEY ("id")
);
