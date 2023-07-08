-- AlterTable
ALTER TABLE "exercise_event" ADD COLUMN     "exercise_id" TEXT,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "difficulty" TEXT,
    "videoUrl" TEXT,
    "muscle_group" TEXT,
    "prime_mover_muscle" TEXT,
    "secondary_muscle" TEXT,
    "tertiary_muscle" TEXT,
    "primary_equipment" TEXT,
    "posture" TEXT,
    "fields_to_show" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_auth_user_id" TEXT NOT NULL,

    CONSTRAINT "exercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX exercise_name_key ON public.exercise USING btree (lower(name))

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_created_by_auth_user_id_fkey" FOREIGN KEY ("created_by_auth_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_event" ADD CONSTRAINT "exercise_event_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;
