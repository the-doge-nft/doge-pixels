/*
  Warnings:

  - Added the required column `baseCurrencyAddress` to the `RainbowSwaps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quoteCurrencyAddress` to the `RainbowSwaps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RainbowSwaps" ADD COLUMN     "baseCurrencyAddress" TEXT NOT NULL,
ADD COLUMN     "quoteCurrencyAddress" TEXT NOT NULL;
