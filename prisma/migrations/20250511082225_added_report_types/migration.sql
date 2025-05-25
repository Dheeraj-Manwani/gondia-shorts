/*
  Warnings:

  - Changed the type of `reason` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('SPAM', 'HARASSMENT', 'HATE_SPEECH', 'MISINFORMATION', 'VIOLENCE', 'SEXUAL_CONTENT', 'PRIVACY_VIOLATION', 'COPYRIGHT', 'OFF_TOPIC', 'OTHER');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "description" TEXT,
DROP COLUMN "reason",
ADD COLUMN     "reason" "ReportReason" NOT NULL;
