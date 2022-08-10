/*
  Warnings:

  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `replies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_author_id_fkey";

-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_post_id_fkey";

-- DropForeignKey
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_submitter_id_fkey";

-- DropTable
DROP TABLE "posts";

-- DropTable
DROP TABLE "replies";

-- DropTable
DROP TABLE "subjects";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "platform" "platform" NOT NULL DEFAULT 'TWITTER',
    "platform_id" VARCHAR NOT NULL,
    "platform_url" VARCHAR NOT NULL,
    "data" JSONB NOT NULL,
    "subject_id" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reply" (
    "id" TEXT NOT NULL,
    "platform" "platform" NOT NULL DEFAULT 'TWITTER',
    "platform_id" VARCHAR NOT NULL,
    "data" JSONB NOT NULL,
    "post_id" TEXT,
    "author_id" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "url" VARCHAR NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "submitter_id" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR,
    "email" VARCHAR,
    "avatar_url" TEXT,
    "twitter_user_id" INTEGER,
    "twitter_username" TEXT,
    "reddit_user_id" TEXT,
    "reddit_username" TEXT,
    "admin" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Post_platform_url_idx" ON "Post"("platform_url");

-- CreateIndex
CREATE INDEX "Post_platform_id_idx" ON "Post"("platform_id");

-- CreateIndex
CREATE INDEX "Post_id_idx" ON "Post"("id");

-- CreateIndex
CREATE INDEX "Reply_id_idx" ON "Reply"("id");

-- CreateIndex
CREATE INDEX "Reply_platform_id_idx" ON "Reply"("platform_id");

-- CreateIndex
CREATE INDEX "Reply_post_id_idx" ON "Reply"("post_id");

-- CreateIndex
CREATE INDEX "Reply_author_id_idx" ON "Reply"("author_id");

-- CreateIndex
CREATE INDEX "Subject_id_idx" ON "Subject"("id");

-- CreateIndex
CREATE INDEX "Subject_url_idx" ON "Subject"("url");

-- CreateIndex
CREATE INDEX "Subject_metadata_idx" ON "Subject"("metadata");

-- CreateIndex
CREATE INDEX "Subject_submitter_id_idx" ON "Subject"("submitter_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_twitter_user_id_key" ON "User"("twitter_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_twitter_username_key" ON "User"("twitter_username");

-- CreateIndex
CREATE UNIQUE INDEX "User_reddit_user_id_key" ON "User"("reddit_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_reddit_username_key" ON "User"("reddit_username");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_submitter_id_fkey" FOREIGN KEY ("submitter_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
