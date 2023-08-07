-- DropForeignKey
ALTER TABLE "widget" DROP CONSTRAINT "widget_owner_id_fkey";

-- AddForeignKey
ALTER TABLE "widget" ADD CONSTRAINT "widget_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
