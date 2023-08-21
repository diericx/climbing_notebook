/*
  Warnings:

  - You are about to drop the column `trainingProgramDayId` on the `exercise_event` table. All the data in the column will be lost.
  - You are about to drop the column `training_program_id` on the `exercise_group` table. All the data in the column will be lost.
  - You are about to drop the column `active_training_program_id` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `training_program_id` on the `widget` table. All the data in the column will be lost.
  - You are about to drop the `_ExerciseGroupToTrainingProgramDay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `training_program` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `training_program_day` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ExerciseGroupToTrainingProgramDay" DROP CONSTRAINT "_ExerciseGroupToTrainingProgramDay_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExerciseGroupToTrainingProgramDay" DROP CONSTRAINT "_ExerciseGroupToTrainingProgramDay_B_fkey";

-- DropForeignKey
ALTER TABLE "exercise_event" DROP CONSTRAINT "exercise_event_trainingProgramDayId_fkey";

-- DropForeignKey
ALTER TABLE "exercise_group" DROP CONSTRAINT "exercise_group_training_program_id_fkey";

-- DropForeignKey
ALTER TABLE "profile" DROP CONSTRAINT "profile_active_training_program_id_fkey";

-- DropForeignKey
ALTER TABLE "training_program" DROP CONSTRAINT "training_program_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "training_program_day" DROP CONSTRAINT "training_program_day_training_program_id_fkey";

-- DropForeignKey
ALTER TABLE "widget" DROP CONSTRAINT "widget_training_program_id_fkey";

-- AlterTable
ALTER TABLE "exercise_event" RENAME COLUMN "trainingProgramDayId" TO "trainingCycleDayId";
-- ALTER TABLE "exercise_event" DROP COLUMN "trainingProgramDayId",
-- ADD COLUMN     "trainingCycleDayId" INTEGER;

-- AlterTable
ALTER TABLE "exercise_group" RENAME COLUMN "training_program_id" TO "training_cycle_id";
-- ALTER TABLE "exercise_group" DROP COLUMN "training_program_id",
-- ADD COLUMN     "training_cycle_id" INTEGER;

-- AlterTable
ALTER TABLE "profile" RENAME COLUMN "active_training_program_id" TO "active_training_cycle_id";
-- ALTER TABLE "profile" DROP COLUMN "active_training_program_id",
-- ADD COLUMN     "active_training_cycle_id" INTEGER;

-- AlterTable
ALTER TABLE "widget" RENAME COLUMN "training_program_id" TO "training_cycle_id";
-- ALTER TABLE "widget" DROP COLUMN "training_program_id",
-- ADD COLUMN     "training_cycle_id" INTEGER;

-- DropTable
ALTER TABLE "_ExerciseGroupToTrainingProgramDay" RENAME TO "_ExerciseGroupToTrainingCycleDay";
-- DROP TABLE "_ExerciseGroupToTrainingProgramDay";

-- DropTable
ALTER TABLE "training_program" RENAME TO "training_cycle";
-- DROP TABLE "training_program";

-- DropTable
ALTER TABLE "training_program_day" RENAME TO "training_cycle_day";
-- DROP TABLE "training_program_day";

ALTER TABLE "training_cycle_day" RENAME COLUMN "training_program_id" TO "training_cycle_id";

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciseGroupToTrainingCycleDay_AB_unique" ON "_ExerciseGroupToTrainingCycleDay"("A", "B");

-- CreateIndex
CREATE INDEX "_ExerciseGroupToTrainingCycleDay_B_index" ON "_ExerciseGroupToTrainingCycleDay"("B");

-- AddForeignKey
ALTER TABLE "exercise_group" ADD CONSTRAINT "exercise_group_training_cycle_id_fkey" FOREIGN KEY ("training_cycle_id") REFERENCES "training_cycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_event" ADD CONSTRAINT "exercise_event_trainingCycleDayId_fkey" FOREIGN KEY ("trainingCycleDayId") REFERENCES "training_cycle_day"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_cycle_day" ADD CONSTRAINT "training_cycle_day_training_cycle_id_fkey" FOREIGN KEY ("training_cycle_id") REFERENCES "training_cycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_cycle" ADD CONSTRAINT "training_cycle_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_active_training_cycle_id_fkey" FOREIGN KEY ("active_training_cycle_id") REFERENCES "training_cycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "widget" ADD CONSTRAINT "widget_training_cycle_id_fkey" FOREIGN KEY ("training_cycle_id") REFERENCES "training_cycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseGroupToTrainingCycleDay" ADD CONSTRAINT "_ExerciseGroupToTrainingCycleDay_A_fkey" FOREIGN KEY ("A") REFERENCES "exercise_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseGroupToTrainingCycleDay" ADD CONSTRAINT "_ExerciseGroupToTrainingCycleDay_B_fkey" FOREIGN KEY ("B") REFERENCES "training_cycle_day"("id") ON DELETE CASCADE ON UPDATE CASCADE;
