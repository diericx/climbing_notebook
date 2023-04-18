-- CreateTable
CREATE TABLE "auth_key" (
    "id" TEXT NOT NULL,
    "hashed_password" TEXT,
    "user_id" INTEGER NOT NULL,
    "primary_key" BOOLEAN NOT NULL,
    "expires" BIGINT,

    CONSTRAINT "auth_key_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_key_id_key" ON "auth_key"("id");

-- CreateIndex
CREATE INDEX "auth_key_user_id_idx" ON "auth_key"("user_id");

-- AddForeignKey
ALTER TABLE "auth_key" ADD CONSTRAINT "auth_key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
