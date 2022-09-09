/*
  Warnings:

  - You are about to drop the column `description` on the `Pixels` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Pixels` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Pixels` table. All the data in the column will be lost.
  - You are about to drop the column `tokenUri` on the `Pixels` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pixels" DROP COLUMN "description",
DROP COLUMN "metadata",
DROP COLUMN "name",
DROP COLUMN "tokenUri";
