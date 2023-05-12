/*
  Warnings:

  - You are about to drop the `chart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "chart" DROP CONSTRAINT "chart_owner_id_fkey";

-- DropTable
DROP TABLE "chart";

-- CreateTable
CREATE TABLE "custom_query" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "table" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "custom_query_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "query_condition" (
    "id" TEXT NOT NULL,
    "column" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "custom_query_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "query_condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "widget" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "width" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "widget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dataset" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'line',
    "name" TEXT NOT NULL,
    "equation" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "query_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_id" TEXT NOT NULL,
    "widgetId" TEXT NOT NULL,

    CONSTRAINT "dataset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "query_condition" ADD CONSTRAINT "query_condition_custom_query_id_fkey" FOREIGN KEY ("custom_query_id") REFERENCES "custom_query"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataset" ADD CONSTRAINT "dataset_query_id_fkey" FOREIGN KEY ("query_id") REFERENCES "custom_query"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataset" ADD CONSTRAINT "dataset_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "widget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
