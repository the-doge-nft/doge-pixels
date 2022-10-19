/*
  Warnings:

  - A unique constraint covering the columns `[uniqueHash]` on the table `PixelTransfers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uniqueHash` to the `PixelTransfers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PixelTransfers" ADD COLUMN     "uniqueHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PixelTransfers_uniqueHash_key" ON "PixelTransfers"("uniqueHash");
