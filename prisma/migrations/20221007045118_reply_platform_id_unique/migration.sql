/*
  Warnings:

  - A unique constraint covering the columns `[platform_id]` on the table `replies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "replies_platform_id_key" ON "replies"("platform_id");
