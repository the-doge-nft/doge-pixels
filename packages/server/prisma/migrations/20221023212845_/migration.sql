/*
  Warnings:

  - Added the required column `clientAddress` to the `RainbowSwaps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RainbowSwaps" ADD COLUMN     "clientAddress" TEXT NOT NULL;
