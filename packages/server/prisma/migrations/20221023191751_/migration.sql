/*
  Warnings:

  - A unique constraint covering the columns `[txHash]` on the table `RainbowSwaps` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RainbowSwaps_txHash_key" ON "RainbowSwaps"("txHash");
