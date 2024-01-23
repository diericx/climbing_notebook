-- DropForeignKey
ALTER TABLE "training_cycle_activation" DROP CONSTRAINT "training_cycle_activation_training_cycle_id_fkey";

-- AlterTable
ALTER TABLE "training_program" ALTER COLUMN "private_access_token" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "training_cycle_activation" ADD CONSTRAINT "training_cycle_activation_training_cycle_id_fkey" FOREIGN KEY ("training_cycle_id") REFERENCES "training_cycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
