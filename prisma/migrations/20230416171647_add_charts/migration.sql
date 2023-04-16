-- CreateTable
CREATE TABLE "chart" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "pattern_to_match" TEXT NOT NULL,
    "equation" TEXT NOT NULL,

    CONSTRAINT "chart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chart" ADD CONSTRAINT "chart_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
