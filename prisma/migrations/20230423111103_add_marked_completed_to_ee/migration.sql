-- AlterTable
ALTER TABLE "exercise_event" ADD COLUMN     "is_marked_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "marked_completed_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
