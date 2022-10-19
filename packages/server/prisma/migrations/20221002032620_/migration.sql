/*
  Warnings:

  - Added the required column `blockCreatedAt` to the `PixelTransfers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PixelTransfers" ADD COLUMN     "blockCreatedAt" TIMESTAMP(3) NOT NULL;
