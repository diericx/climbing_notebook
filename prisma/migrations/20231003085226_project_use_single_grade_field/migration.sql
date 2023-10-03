/*
  Warnings:

  - You are about to drop the column `font_grade` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `hueco_grade` on the `project` table. All the data in the column will be lost.
  - Added the required column `grade` to the `project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "project" ADD COLUMN "grade" TEXT;

UPDATE "project" SET grade = COALESCE(font_grade, hueco_grade, '6A');

ALTER TABLE "project" ALTER COLUMN "grade" SET NOT NULL;

ALTER TABLE "project" DROP COLUMN "font_grade",
DROP COLUMN "hueco_grade";
