-- AlterTable
ALTER TABLE "widget" ADD COLUMN     "training_program_id" INTEGER;

-- AddForeignKey
ALTER TABLE "widget" ADD CONSTRAINT "widget_training_program_id_fkey" FOREIGN KEY ("training_program_id") REFERENCES "training_program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
