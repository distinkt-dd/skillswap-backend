-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "user_from_id" TEXT NOT NULL,
    "user_to_id" TEXT NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_from_id_fkey" FOREIGN KEY ("user_from_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_to_id_fkey" FOREIGN KEY ("user_to_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
