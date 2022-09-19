-- AlterTable
ALTER TABLE "users" ADD COLUMN     "reddit_access_token" TEXT,
ADD COLUMN     "reddit_refresh_token" TEXT,
ADD COLUMN     "twitter_access_secret" TEXT,
ADD COLUMN     "twitter_access_token" TEXT;
