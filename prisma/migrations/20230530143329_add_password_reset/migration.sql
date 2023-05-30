-- CreateTable
CREATE TABLE "auth_password_reset" (
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_password_reset_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_password_reset_user_id_key" ON "auth_password_reset"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_password_reset_token_key" ON "auth_password_reset"("token");

-- AddForeignKey
ALTER TABLE "auth_password_reset" ADD CONSTRAINT "auth_password_reset_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
