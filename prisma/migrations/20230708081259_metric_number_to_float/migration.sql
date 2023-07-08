/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `exercise` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "metric" ALTER COLUMN "value" SET DATA TYPE DOUBLE PRECISION;
