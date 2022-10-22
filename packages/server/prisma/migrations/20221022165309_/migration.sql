-- CreateTable
CREATE TABLE "RainbowSwaps" (
    "id" SERIAL NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "blockCreatedAt" TIMESTAMP(3) NOT NULL,
    "insertedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "baseCurrency" TEXT NOT NULL,
    "quoteCurrency" TEXT NOT NULL,
    "baseAmount" TEXT NOT NULL,
    "quoteAmount" TEXT NOT NULL,

    CONSTRAINT "RainbowSwaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donations" (
    "id" SERIAL NOT NULL,
    "currency" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "amount" TEXT NOT NULL,

    CONSTRAINT "Donations_pkey" PRIMARY KEY ("id")
);
