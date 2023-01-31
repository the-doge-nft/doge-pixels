-- AlterTable
ALTER TABLE "DonationHookRequest" ADD COLUMN     "attempt" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isSuccessful" BOOLEAN NOT NULL DEFAULT false;
