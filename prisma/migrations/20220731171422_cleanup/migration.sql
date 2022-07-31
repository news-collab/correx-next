/*
  Warnings:

  - The primary key for the `post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `platformId` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `starred` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `post` table. All the data in the column will be lost.
  - The `platform` column on the `post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `reply` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `platformId` on the `reply` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `reply` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `reply` table. All the data in the column will be lost.
  - The `platform` column on the `reply` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `subject` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `subject` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `subject` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `avatarUrl` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `reddit_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `screenname` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `tokenSecret` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `twitterCreatedAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `migrations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `platform_id_hash` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform_id_str` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform_url` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform_id_hash` to the `reply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform_id_str` to the `reply` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "platform" AS ENUM ('TWITTER', 'REDDIT');

-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_userId_fkey";

-- DropForeignKey
ALTER TABLE "reply" DROP CONSTRAINT "reply_postId_fkey";

-- DropForeignKey
ALTER TABLE "reply" DROP CONSTRAINT "reply_userId_fkey";

-- DropForeignKey
ALTER TABLE "subject" DROP CONSTRAINT "subject_userId_fkey";

-- DropIndex
DROP INDEX "post_url_idx";

-- DropIndex
DROP INDEX "subject_uuid_idx";

-- AlterTable
ALTER TABLE "post" DROP CONSTRAINT "post_pkey",
DROP COLUMN "platformId",
DROP COLUMN "starred",
DROP COLUMN "subjectId",
DROP COLUMN "url",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "platform_id_hash" INTEGER NOT NULL,
ADD COLUMN     "platform_id_str" VARCHAR NOT NULL,
ADD COLUMN     "platform_url" VARCHAR NOT NULL,
ADD COLUMN     "subject_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "platform",
ADD COLUMN     "platform" "platform" NOT NULL DEFAULT 'TWITTER',
ADD CONSTRAINT "post_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "post_id_seq";

-- AlterTable
ALTER TABLE "reply" DROP CONSTRAINT "reply_pkey",
DROP COLUMN "platformId",
DROP COLUMN "postId",
DROP COLUMN "userId",
ADD COLUMN     "author_id" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "platform_id_hash" INTEGER NOT NULL,
ADD COLUMN     "platform_id_str" VARCHAR NOT NULL,
ADD COLUMN     "post_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "platform",
ADD COLUMN     "platform" "platform" NOT NULL DEFAULT 'TWITTER',
ADD CONSTRAINT "reply_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "reply_id_seq";

-- AlterTable
ALTER TABLE "subject" DROP CONSTRAINT "subject_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "userId",
DROP COLUMN "uuid",
ADD COLUMN     "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "submitter_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "subject_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "subject_id_seq";

-- AlterTable
ALTER TABLE "user" DROP CONSTRAINT "user_pkey",
DROP COLUMN "avatarUrl",
DROP COLUMN "description",
DROP COLUMN "reddit_id",
DROP COLUMN "screenname",
DROP COLUMN "token",
DROP COLUMN "tokenSecret",
DROP COLUMN "twitterCreatedAt",
DROP COLUMN "verified",
ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "email" VARCHAR,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "user_id_seq";

-- DropTable
DROP TABLE "migrations";

-- DropEnum
DROP TYPE "post_platform_enum";

-- DropEnum
DROP TYPE "reply_platform_enum";

-- CreateTable
CREATE TABLE "user_platforms" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "platform" "platform" NOT NULL DEFAULT 'TWITTER',
    "platform_id_hash" INTEGER NOT NULL,
    "platform_id_str" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_platforms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_platform_url_idx" ON "post"("platform_url");

-- CreateIndex
CREATE INDEX "post_platform_id_hash_idx" ON "post"("platform_id_hash");

-- CreateIndex
CREATE INDEX "post_platform_id_str_idx" ON "post"("platform_id_str");

-- CreateIndex
CREATE INDEX "reply_platform_id_hash_idx" ON "reply"("platform_id_hash");

-- CreateIndex
CREATE INDEX "reply_platform_id_str_idx" ON "reply"("platform_id_str");

-- CreateIndex
CREATE INDEX "reply_post_id_idx" ON "reply"("post_id");

-- CreateIndex
CREATE INDEX "reply_author_id_idx" ON "reply"("author_id");

-- CreateIndex
CREATE INDEX "subject_submitter_id_idx" ON "subject"("submitter_id");

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reply" ADD CONSTRAINT "reply_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reply" ADD CONSTRAINT "reply_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_submitter_id_fkey" FOREIGN KEY ("submitter_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_platforms" ADD CONSTRAINT "user_platforms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
