/*
  Warnings:

  - You are about to drop the `training_event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "training_event" DROP CONSTRAINT "training_event_owner_id_fkey";

-- DropTable
DROP TABLE "training_event";
