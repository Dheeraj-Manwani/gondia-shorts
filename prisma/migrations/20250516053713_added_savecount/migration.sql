/*
  Warnings:

  - You are about to drop the column `dislikeCount` on the `Article` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "InteractionType" ADD VALUE 'SAVE';

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "dislikeCount",
ADD COLUMN     "saveCount" INTEGER NOT NULL DEFAULT 0;
