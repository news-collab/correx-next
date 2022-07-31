/*
  Warnings:

  - You are about to drop the column `platform_id_hash` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `platform_id_str` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `platform_id_hash` on the `replies` table. All the data in the column will be lost.
  - You are about to drop the column `platform_id_str` on the `replies` table. All the data in the column will be lost.
  - You are about to drop the column `platform_id_hash` on the `user_platforms` table. All the data in the column will be lost.
  - You are about to drop the column `platform_id_str` on the `user_platforms` table. All the data in the column will be lost.
  - Added the required column `platform_id` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform_id` to the `replies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform_id` to the `user_platforms` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "posts_platform_id_hash_idx";

-- DropIndex
DROP INDEX "posts_platform_id_str_idx";

-- DropIndex
DROP INDEX "replies_platform_id_hash_idx";

-- DropIndex
DROP INDEX "replies_platform_id_str_idx";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "platform_id_hash",
DROP COLUMN "platform_id_str",
ADD COLUMN     "platform_id" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "replies" DROP COLUMN "platform_id_hash",
DROP COLUMN "platform_id_str",
ADD COLUMN     "platform_id" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "user_platforms" DROP COLUMN "platform_id_hash",
DROP COLUMN "platform_id_str",
ADD COLUMN     "platform_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "posts_platform_id_idx" ON "posts"("platform_id");

-- CreateIndex
CREATE INDEX "replies_platform_id_idx" ON "replies"("platform_id");
