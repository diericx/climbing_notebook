/*
  Warnings:

  - You are about to drop the column `active_training_cycle_id` on the `profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[training_program_id,name]` on the table `training_cycle` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "profile" DROP CONSTRAINT "profile_active_training_cycle_id_fkey";

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "active_training_cycle_id";

-- AlterTable
ALTER TABLE "training_program" ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "training_program_on_auth_user" (
    "training_program_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "training_program_on_auth_user_pkey" PRIMARY KEY ("training_program_id","user_id")
);

-- CreateTable
CREATE TABLE "training_cycle_on_auth_user" (
    "training_cycle_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "training_cycle_on_auth_user_pkey" PRIMARY KEY ("training_cycle_id","user_id")
);

-- CreateTable
CREATE TABLE "training_cycle_activation" (
    "training_cycle_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "training_cycle_activation_pkey" PRIMARY KEY ("training_cycle_id","user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "training_cycle_training_program_id_name_key" ON "training_cycle"("training_program_id", "name");

-- AddForeignKey
ALTER TABLE "training_program_on_auth_user" ADD CONSTRAINT "training_program_on_auth_user_training_program_id_fkey" FOREIGN KEY ("training_program_id") REFERENCES "training_program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_program_on_auth_user" ADD CONSTRAINT "training_program_on_auth_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_cycle_on_auth_user" ADD CONSTRAINT "training_cycle_on_auth_user_training_cycle_id_fkey" FOREIGN KEY ("training_cycle_id") REFERENCES "training_cycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_cycle_on_auth_user" ADD CONSTRAINT "training_cycle_on_auth_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_cycle_activation" ADD CONSTRAINT "training_cycle_activation_training_cycle_id_fkey" FOREIGN KEY ("training_cycle_id") REFERENCES "training_cycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_cycle_activation" ADD CONSTRAINT "training_cycle_activation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
