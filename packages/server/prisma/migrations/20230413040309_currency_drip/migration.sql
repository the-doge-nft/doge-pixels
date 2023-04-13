-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('ERC20', 'ERC721', 'ERC1155');

-- CreateTable
CREATE TABLE "CurrencyDrip" (
    "id" SERIAL NOT NULL,
    "insertedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "currencyTokenId" TEXT,
    "currencyAmountAtoms" TEXT NOT NULL,
    "currencyId" INTEGER NOT NULL,
    "txId" TEXT NOT NULL,

    CONSTRAINT "CurrencyDrip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "id" SERIAL NOT NULL,
    "type" "TokenType" NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "symbol" TEXT,
    "name" TEXT,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CurrencyDrip_txId_key" ON "CurrencyDrip"("txId");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_contractAddress_key" ON "Currency"("contractAddress");

-- AddForeignKey
ALTER TABLE "CurrencyDrip" ADD CONSTRAINT "CurrencyDrip_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
