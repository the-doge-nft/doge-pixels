/*
  Warnings:

  - Added the required column `txHash` to the `RainbowSwaps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RainbowSwaps" ADD COLUMN     "txHash" TEXT NOT NULL;
