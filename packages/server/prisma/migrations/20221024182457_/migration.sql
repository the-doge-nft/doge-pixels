-- CreateEnum
CREATE TYPE "ClientSide" AS ENUM ('BUY', 'SELL');

-- CreateTable
CREATE TABLE "RainbowSwaps" (
    "id" SERIAL NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "blockCreatedAt" TIMESTAMP(3) NOT NULL,
    "insertedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "baseCurrency" TEXT NOT NULL,
    "quoteCurrency" TEXT NOT NULL,
    "baseAmount" DOUBLE PRECISION NOT NULL,
    "quoteAmount" DOUBLE PRECISION NOT NULL,
    "clientSide" "ClientSide" NOT NULL,
    "txHash" TEXT NOT NULL,
    "clientAddress" TEXT NOT NULL,
    "donatedCurrency" TEXT NOT NULL,
    "donatedAmount" DOUBLE PRECISION NOT NULL,
    "baseCurrencyAddress" TEXT,
    "quoteCurrencyAddress" TEXT,
    "donatedCurrencyAddress" TEXT,

    CONSTRAINT "RainbowSwaps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RainbowSwaps_txHash_key" ON "RainbowSwaps"("txHash");
