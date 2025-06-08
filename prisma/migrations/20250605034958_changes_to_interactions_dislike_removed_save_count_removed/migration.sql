/*
  Warnings:

  - The values [DISLIKE] on the enum `InteractionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `saveCount` on the `Article` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,articleId,type]` on the table `Interaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,commentId,type]` on the table `Interaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InteractionType_new" AS ENUM ('LIKE', 'SAVE');
ALTER TABLE "Interaction" ALTER COLUMN "type" TYPE "InteractionType_new" USING ("type"::text::"InteractionType_new");
ALTER TYPE "InteractionType" RENAME TO "InteractionType_old";
ALTER TYPE "InteractionType_new" RENAME TO "InteractionType";
DROP TYPE "InteractionType_old";
COMMIT;

-- DropIndex
DROP INDEX "Interaction_userId_articleId_key";

-- DropIndex
DROP INDEX "Interaction_userId_commentId_key";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "saveCount";

-- CreateIndex
CREATE UNIQUE INDEX "Interaction_userId_articleId_type_key" ON "Interaction"("userId", "articleId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Interaction_userId_commentId_type_key" ON "Interaction"("userId", "commentId", "type");
