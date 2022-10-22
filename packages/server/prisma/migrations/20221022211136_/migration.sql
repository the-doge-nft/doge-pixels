/*
  Warnings:

  - Added the required column `clientSide` to the `RainbowSwaps` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClientSide" AS ENUM ('BUY', 'SELL');

-- AlterTable
ALTER TABLE "RainbowSwaps" ADD COLUMN     "clientSide" "ClientSide" NOT NULL;
