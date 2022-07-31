/*
  Warnings:

  - You are about to drop the `user_platforms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_platforms" DROP CONSTRAINT "user_platforms_user_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "reddit_user_id" TEXT,
ADD COLUMN     "reddit_username" TEXT,
ADD COLUMN     "twitter_user_id" INTEGER,
ADD COLUMN     "twitter_username" TEXT;

-- DropTable
DROP TABLE "user_platforms";
