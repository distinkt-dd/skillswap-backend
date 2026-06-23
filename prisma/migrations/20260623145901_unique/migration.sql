/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `offers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "offers_userId_key" ON "offers"("userId");
