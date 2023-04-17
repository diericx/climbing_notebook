/*
  Warnings:

  - Added the required column `match_against` to the `chart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chart" ADD COLUMN     "match_against" TEXT NOT NULL;
