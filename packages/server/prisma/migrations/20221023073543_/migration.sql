/*
  Warnings:

  - Changed the type of `baseAmount` on the `RainbowSwaps` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `quoteAmount` on the `RainbowSwaps` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "RainbowSwaps" DROP COLUMN "baseAmount",
ADD COLUMN     "baseAmount" DOUBLE PRECISION NOT NULL,
DROP COLUMN "quoteAmount",
ADD COLUMN     "quoteAmount" DOUBLE PRECISION NOT NULL;
