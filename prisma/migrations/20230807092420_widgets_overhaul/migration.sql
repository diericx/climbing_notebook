/*
  Warnings:

  - You are about to drop the column `operator` on the `custom_query` table. All the data in the column will be lost.
  - You are about to drop the column `custom_query_id` on the `dataset` table. All the data in the column will be lost.
  - You are about to drop the column `equation` on the `dataset` table. All the data in the column will be lost.
  - Added the required column `dataset_id` to the `custom_query` table without a default value. This is not possible if the table is not empty.
  - Added the required column `equation` to the `custom_query` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `value` on the `query_condition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `is_template` to the `widget` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "dataset" DROP CONSTRAINT "dataset_custom_query_id_fkey";

-- AlterTable
ALTER TABLE "custom_query" DROP COLUMN "operator",
ADD COLUMN     "dataset_id" TEXT NOT NULL,
ADD COLUMN     "equation" TEXT NOT NULL,
ADD COLUMN     "exercise_id" TEXT,
ADD COLUMN     "metric" TEXT;

-- AlterTable
ALTER TABLE "dataset" DROP COLUMN "custom_query_id",
DROP COLUMN "equation";

-- AlterTable
ALTER TABLE "query_condition" ADD COLUMN     "use_widget_field" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "widget_field_to_use" TEXT,
DROP COLUMN "value",
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "widget" ADD COLUMN     "description" TEXT,
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_template" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "minutes" INTEGER,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "reps" INTEGER,
ADD COLUMN     "seconds" INTEGER,
ADD COLUMN     "sets" INTEGER,
ADD COLUMN     "use_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "weight" INTEGER;

-- AddForeignKey
ALTER TABLE "custom_query" ADD CONSTRAINT "custom_query_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_query" ADD CONSTRAINT "custom_query_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "dataset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "widget" ADD CONSTRAINT "widget_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
