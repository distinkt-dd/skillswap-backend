/*
  Warnings:

  - Added the required column `offer_to_id` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "offer_to_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_offer_to_id_fkey" FOREIGN KEY ("offer_to_id") REFERENCES "offers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
