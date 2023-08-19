/*
  Warnings:

  - You are about to drop the column `expires` on the `auth_key` table. All the data in the column will be lost.
  - You are about to drop the column `primary_key` on the `auth_key` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "auth_key" DROP COLUMN "expires",
DROP COLUMN "primary_key";
