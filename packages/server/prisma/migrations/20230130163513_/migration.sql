-- CreateEnum
CREATE TYPE "Campaign" AS ENUM ('STATUE', 'PH');

-- AlterTable
ALTER TABLE "Donations" ADD COLUMN     "campaign" "Campaign" NOT NULL DEFAULT 'STATUE';
