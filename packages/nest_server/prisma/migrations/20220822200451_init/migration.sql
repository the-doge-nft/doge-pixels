/*
  Warnings:

  - A unique constraint covering the columns `[tokenId]` on the table `Pixels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Pixels_tokenId_key" ON "Pixels"("tokenId");
