/*
  Warnings:

  - A unique constraint covering the columns `[txHash]` on the table `Donations` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `blockchain` on the `Donations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ChainName" AS ENUM ('DOGE', 'ETHEREUM');

-- AlterTable
ALTER TABLE "Donations" DROP COLUMN "blockchain",
ADD COLUMN     "blockchain" "ChainName" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Donations_txHash_key" ON "Donations"("txHash");
