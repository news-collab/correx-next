/*
  Warnings:

  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reply` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reply" DROP CONSTRAINT "reply_author_id_fkey";

-- DropForeignKey
ALTER TABLE "reply" DROP CONSTRAINT "reply_post_id_fkey";

-- DropForeignKey
ALTER TABLE "subject" DROP CONSTRAINT "subject_submitter_id_fkey";

-- DropForeignKey
ALTER TABLE "user_platforms" DROP CONSTRAINT "user_platforms_user_id_fkey";

-- DropTable
DROP TABLE "post";

-- DropTable
DROP TABLE "reply";

-- DropTable
DROP TABLE "subject";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "platform" "platform" NOT NULL DEFAULT 'TWITTER',
    "platform_id_hash" INTEGER NOT NULL,
    "platform_id_str" VARCHAR NOT NULL,
    "platform_url" VARCHAR NOT NULL,
    "data" JSONB NOT NULL,
    "subject_id" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "replies" (
    "id" TEXT NOT NULL,
    "platform" "platform" NOT NULL DEFAULT 'TWITTER',
    "platform_id_hash" INTEGER NOT NULL,
    "platform_id_str" VARCHAR NOT NULL,
    "data" JSONB NOT NULL,
    "post_id" TEXT,
    "author_id" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "url" VARCHAR NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "submitter_id" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "twitterId" VARCHAR,
    "name" VARCHAR,
    "email" VARCHAR,
    "avatar_url" TEXT,
    "admin" BOOLEAN DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "posts_platform_url_idx" ON "posts"("platform_url");

-- CreateIndex
CREATE INDEX "posts_platform_id_hash_idx" ON "posts"("platform_id_hash");

-- CreateIndex
CREATE INDEX "posts_platform_id_str_idx" ON "posts"("platform_id_str");

-- CreateIndex
CREATE INDEX "posts_id_idx" ON "posts"("id");

-- CreateIndex
CREATE INDEX "replies_id_idx" ON "replies"("id");

-- CreateIndex
CREATE INDEX "replies_platform_id_hash_idx" ON "replies"("platform_id_hash");

-- CreateIndex
CREATE INDEX "replies_platform_id_str_idx" ON "replies"("platform_id_str");

-- CreateIndex
CREATE INDEX "replies_post_id_idx" ON "replies"("post_id");

-- CreateIndex
CREATE INDEX "replies_author_id_idx" ON "replies"("author_id");

-- CreateIndex
CREATE INDEX "subjects_id_idx" ON "subjects"("id");

-- CreateIndex
CREATE INDEX "subjects_url_idx" ON "subjects"("url");

-- CreateIndex
CREATE INDEX "subjects_metadata_idx" ON "subjects"("metadata");

-- CreateIndex
CREATE INDEX "subjects_submitter_id_idx" ON "subjects"("submitter_id");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_submitter_id_fkey" FOREIGN KEY ("submitter_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_platforms" ADD CONSTRAINT "user_platforms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
