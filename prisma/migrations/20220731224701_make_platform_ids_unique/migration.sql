/*
  Warnings:

  - A unique constraint covering the columns `[twitter_user_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[twitter_username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reddit_user_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reddit_username]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_twitter_user_id_key" ON "users"("twitter_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_twitter_username_key" ON "users"("twitter_username");

-- CreateIndex
CREATE UNIQUE INDEX "users_reddit_user_id_key" ON "users"("reddit_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_reddit_username_key" ON "users"("reddit_username");
