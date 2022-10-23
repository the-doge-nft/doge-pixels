-- AlterTable
ALTER TABLE "RainbowSwaps" ADD COLUMN     "donatedCurrencyAddress" TEXT,
ALTER COLUMN "baseCurrencyAddress" DROP NOT NULL,
ALTER COLUMN "quoteCurrencyAddress" DROP NOT NULL;
