/*
  Warnings:

  - Added the required column `blockNumber` to the `Donations` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `amount` on the `Donations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Donations" ADD COLUMN     "blockNumber" INTEGER NOT NULL,
DROP COLUMN "amount",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;
