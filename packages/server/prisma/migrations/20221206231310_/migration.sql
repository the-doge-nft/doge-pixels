-- CreateEnum
CREATE TYPE "EthereumNetwork" AS ENUM ('MAINNET', 'POLYGON', 'ARBITRUM');

-- AlterTable
ALTER TABLE "RainbowSwaps" ADD COLUMN     "network" "EthereumNetwork";
