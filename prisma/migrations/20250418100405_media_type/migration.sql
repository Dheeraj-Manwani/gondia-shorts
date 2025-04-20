/*
  Warnings:

  - You are about to drop the column `isVideo` on the `Article` table. All the data in the column will be lost.
  - Added the required column `mediaType` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'YOUTUBE');

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "isVideo",
ADD COLUMN     "mediaType" "MediaType" NOT NULL;
