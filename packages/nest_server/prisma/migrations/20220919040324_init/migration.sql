-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "s3Id" TEXT NOT NULL,
    "s3filename" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimetype" TEXT NOT NULL,
    "insertedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_s3Id_key" ON "Media"("s3Id");
