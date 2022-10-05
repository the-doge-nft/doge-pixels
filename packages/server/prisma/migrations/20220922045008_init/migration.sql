-- CreateTable
CREATE TABLE "PixelTransfers" (
    "id" SERIAL NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "insertedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,

    CONSTRAINT "PixelTransfers_pkey" PRIMARY KEY ("id")
);
