/*
  Warnings:

  - You are about to drop the column `query_id` on the `dataset` table. All the data in the column will be lost.
  - You are about to drop the column `widgetId` on the `dataset` table. All the data in the column will be lost.
  - Added the required column `custom_query_id` to the `dataset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `widget_id` to the `dataset` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "dataset" DROP CONSTRAINT "dataset_query_id_fkey";

-- DropForeignKey
ALTER TABLE "dataset" DROP CONSTRAINT "dataset_widgetId_fkey";

-- AlterTable
ALTER TABLE "dataset" DROP COLUMN "query_id",
DROP COLUMN "widgetId",
ADD COLUMN     "custom_query_id" TEXT NOT NULL,
ADD COLUMN     "widget_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "dataset" ADD CONSTRAINT "dataset_custom_query_id_fkey" FOREIGN KEY ("custom_query_id") REFERENCES "custom_query"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataset" ADD CONSTRAINT "dataset_widget_id_fkey" FOREIGN KEY ("widget_id") REFERENCES "widget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
