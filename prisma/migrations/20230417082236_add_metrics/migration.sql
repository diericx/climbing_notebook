-- CreateTable
CREATE TABLE "metric" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "journalEntryId" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,

    CONSTRAINT "metric_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "metric" ADD CONSTRAINT "metric_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "journal_entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric" ADD CONSTRAINT "metric_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
