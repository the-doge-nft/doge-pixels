/*
  Warnings:

  - The values [DOGE] on the enum `ChainName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChainName_new" AS ENUM ('DOGECOIN', 'ETHEREUM');
ALTER TABLE "Donations" ALTER COLUMN "blockchain" TYPE "ChainName_new" USING ("blockchain"::text::"ChainName_new");
ALTER TYPE "ChainName" RENAME TO "ChainName_old";
ALTER TYPE "ChainName_new" RENAME TO "ChainName";
DROP TYPE "ChainName_old";
COMMIT;
