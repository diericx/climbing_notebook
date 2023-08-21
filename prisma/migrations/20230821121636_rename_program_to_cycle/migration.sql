-- AlterTable
ALTER TABLE "training_cycle" RENAME CONSTRAINT "training_program_pkey" TO "training_cycle_pkey";

-- AlterTable
ALTER TABLE "training_cycle_day" RENAME CONSTRAINT "training_program_day_pkey" TO "training_cycle_day_pkey";
