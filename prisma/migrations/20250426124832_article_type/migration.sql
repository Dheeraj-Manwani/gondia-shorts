/*
  Warnings:

  - You are about to drop the column `mediaType` on the `Article` table. All the data in the column will be lost.
  - Added the required column `type` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ArticleType" AS ENUM ('IMAGE_N_TEXT', 'VIDEO_N_TEXT', 'FULL_IMAGE', 'FULL_VIDEO', 'YOUTUBE');

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "mediaType",
ADD COLUMN     "type" "ArticleType" NOT NULL;

-- DropEnum
DROP TYPE "MediaType";
