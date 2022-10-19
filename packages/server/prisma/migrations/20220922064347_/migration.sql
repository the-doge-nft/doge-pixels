/*
  Warnings:

  - You are about to drop the column `uniqueHash` on the `PixelTransfers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uniqueTransferId]` on the table `PixelTransfers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uniqueTransferId` to the `PixelTransfers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PixelTransfers_uniqueHash_key";

-- AlterTable
ALTER TABLE "PixelTransfers" DROP COLUMN "uniqueHash",
ADD COLUMN     "uniqueTransferId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PixelTransfers_uniqueTransferId_key" ON "PixelTransfers"("uniqueTransferId");
