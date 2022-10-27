-- CreateTable
CREATE TABLE "Donations" (
    "id" SERIAL NOT NULL,
    "blockCreatedAt" TIMESTAMP(3) NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "blockchain" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "amount" TEXT NOT NULL,

    CONSTRAINT "Donations_pkey" PRIMARY KEY ("id")
);
