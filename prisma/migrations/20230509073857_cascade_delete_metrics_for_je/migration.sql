-- DropForeignKey
ALTER TABLE "metric" DROP CONSTRAINT "metric_journalEntryId_fkey";

-- AddForeignKey
ALTER TABLE "metric" ADD CONSTRAINT "metric_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "journal_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
