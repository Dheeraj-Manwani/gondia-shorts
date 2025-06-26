-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('EMAIL', 'GOOGLE');

-- AlterEnum
ALTER TYPE "ArticleType" ADD VALUE 'YOUTUBE_SHORTS';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "salt" TEXT,
ADD COLUMN     "type" "AuthType" NOT NULL DEFAULT 'GOOGLE',
ALTER COLUMN "password" DROP NOT NULL;
