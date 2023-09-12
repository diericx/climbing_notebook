create extension if not exists "pgcrypto";

-- AlterTable
ALTER TABLE "training_cycle" ADD COLUMN     "description" TEXT,
ADD COLUMN     "parent_id" INTEGER,
ADD COLUMN     "privateUrlToken" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN     "training_program_id" TEXT,
ADD COLUMN     "use_count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "training_program" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "use_count" INTEGER NOT NULL DEFAULT 0,
    "parent_id" TEXT,
    "privateUrlToken" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "training_program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_program_scheduled_slot" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "training_program_id" TEXT NOT NULL,

    CONSTRAINT "training_program_scheduled_slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_program_activation" (
    "id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "training_program_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "training_program_activation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TrainingCycleToTrainingProgramScheduledSlot" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TrainingCycleToTrainingProgramScheduledSlot_AB_unique" ON "_TrainingCycleToTrainingProgramScheduledSlot"("A", "B");

-- CreateIndex
CREATE INDEX "_TrainingCycleToTrainingProgramScheduledSlot_B_index" ON "_TrainingCycleToTrainingProgramScheduledSlot"("B");

-- AddForeignKey
ALTER TABLE "training_program" ADD CONSTRAINT "training_program_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_program_scheduled_slot" ADD CONSTRAINT "training_program_scheduled_slot_training_program_id_fkey" FOREIGN KEY ("training_program_id") REFERENCES "training_program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_program_activation" ADD CONSTRAINT "training_program_activation_training_program_id_fkey" FOREIGN KEY ("training_program_id") REFERENCES "training_program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_program_activation" ADD CONSTRAINT "training_program_activation_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_cycle" ADD CONSTRAINT "training_cycle_training_program_id_fkey" FOREIGN KEY ("training_program_id") REFERENCES "training_program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrainingCycleToTrainingProgramScheduledSlot" ADD CONSTRAINT "_TrainingCycleToTrainingProgramScheduledSlot_A_fkey" FOREIGN KEY ("A") REFERENCES "training_cycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrainingCycleToTrainingProgramScheduledSlot" ADD CONSTRAINT "_TrainingCycleToTrainingProgramScheduledSlot_B_fkey" FOREIGN KEY ("B") REFERENCES "training_program_scheduled_slot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
