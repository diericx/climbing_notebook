-- AlterTable
ALTER TABLE "exercise_event" ADD COLUMN     "exerciseGroupId" INTEGER;

-- CreateTable
CREATE TABLE "exercise_group" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "training_program_id" INTEGER,

    CONSTRAINT "exercise_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExerciseGroupToTrainingProgramDay" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciseGroupToTrainingProgramDay_AB_unique" ON "_ExerciseGroupToTrainingProgramDay"("A", "B");

-- CreateIndex
CREATE INDEX "_ExerciseGroupToTrainingProgramDay_B_index" ON "_ExerciseGroupToTrainingProgramDay"("B");

-- AddForeignKey
ALTER TABLE "exercise_group" ADD CONSTRAINT "exercise_group_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_group" ADD CONSTRAINT "exercise_group_training_program_id_fkey" FOREIGN KEY ("training_program_id") REFERENCES "training_program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_event" ADD CONSTRAINT "exercise_event_exerciseGroupId_fkey" FOREIGN KEY ("exerciseGroupId") REFERENCES "exercise_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseGroupToTrainingProgramDay" ADD CONSTRAINT "_ExerciseGroupToTrainingProgramDay_A_fkey" FOREIGN KEY ("A") REFERENCES "exercise_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseGroupToTrainingProgramDay" ADD CONSTRAINT "_ExerciseGroupToTrainingProgramDay_B_fkey" FOREIGN KEY ("B") REFERENCES "training_program_day"("id") ON DELETE CASCADE ON UPDATE CASCADE;
