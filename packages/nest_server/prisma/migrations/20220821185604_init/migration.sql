-- CreateTable
CREATE TABLE "PixelTransfers" (
    "id" SERIAL NOT NULL,
    "insertedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactedAt" TIMESTAMP(3) NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "txHash" TEXT NOT NULL,

    CONSTRAINT "PixelTransfers_pkey" PRIMARY KEY ("id")
);
