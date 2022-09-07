/*
  Warnings:

  - A unique constraint covering the columns `[tokenId]` on the table `PixelTransfers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[txHash]` on the table `PixelTransfers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PixelTransfers_tokenId_key" ON "PixelTransfers"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "PixelTransfers_txHash_key" ON "PixelTransfers"("txHash");
