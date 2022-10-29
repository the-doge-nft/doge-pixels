-- CreateEnum
CREATE TYPE "ChainName" AS ENUM ('DOGECOIN', 'ETHEREUM');

-- CreateTable
CREATE TABLE "Donations" (
    "id" SERIAL NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "blockCreatedAt" TIMESTAMP(3) NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "blockchain" "ChainName" NOT NULL,
    "currency" TEXT NOT NULL,
    "currencyContractAddress" TEXT,
    "txHash" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Donations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Donations_txHash_key" ON "Donations"("txHash");
