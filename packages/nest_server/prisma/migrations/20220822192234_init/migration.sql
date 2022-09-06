/*
  Warnings:

  - You are about to drop the `PixelTransfers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "PixelTransfers";

-- CreateTable
CREATE TABLE "Pixels" (
    "id" SERIAL NOT NULL,
    "insertedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerAddress" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tokenUri" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,

    CONSTRAINT "Pixels_pkey" PRIMARY KEY ("id")
);
