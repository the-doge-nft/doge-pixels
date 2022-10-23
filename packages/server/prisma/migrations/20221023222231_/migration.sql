/*
  Warnings:

  - Added the required column `donatedAmount` to the `RainbowSwaps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `donatedCurrency` to the `RainbowSwaps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RainbowSwaps" ADD COLUMN     "donatedAmount" TEXT NOT NULL,
ADD COLUMN     "donatedCurrency" TEXT NOT NULL;
