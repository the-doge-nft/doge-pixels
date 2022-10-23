/*
  Warnings:

  - Changed the type of `donatedAmount` on the `RainbowSwaps` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "RainbowSwaps" DROP COLUMN "donatedAmount",
ADD COLUMN     "donatedAmount" DOUBLE PRECISION NOT NULL;
