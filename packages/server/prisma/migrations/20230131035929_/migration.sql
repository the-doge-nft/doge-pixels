-- CreateTable
CREATE TABLE "DonationHookRequest" (
    "id" SERIAL NOT NULL,
    "insertedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "donationId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "responseCode" INTEGER,
    "response" TEXT,

    CONSTRAINT "DonationHookRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DonationHookRequest" ADD CONSTRAINT "DonationHookRequest_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
