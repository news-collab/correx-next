-- CreateEnum
CREATE TYPE "post_platform_enum" AS ENUM ('TWITTER', 'REDDIT');

-- CreateEnum
CREATE TYPE "reply_platform_enum" AS ENUM ('TWITTER', 'REDDIT');

-- CreateTable
CREATE TABLE "migrations" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "platform" "post_platform_enum" NOT NULL DEFAULT 'TWITTER',
    "platformId" VARCHAR NOT NULL,
    "url" VARCHAR NOT NULL,
    "data" JSONB NOT NULL,
    "subjectId" INTEGER,
    "starred" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER,

    CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reply" (
    "id" SERIAL NOT NULL,
    "platform" "reply_platform_enum" NOT NULL DEFAULT 'TWITTER',
    "platformId" VARCHAR NOT NULL,
    "data" JSONB NOT NULL,
    "postId" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "PK_94fa9017051b40a71e000a2aff9" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR NOT NULL,
    "uuid" VARCHAR NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "userId" INTEGER,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_12eee115462e38d62e5455fc054" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "twitterId" VARCHAR,
    "name" VARCHAR,
    "screenname" VARCHAR,
    "description" VARCHAR NOT NULL,
    "verified" BOOLEAN,
    "twitterCreatedAt" TIMESTAMP(6),
    "token" VARCHAR,
    "tokenSecret" VARCHAR,
    "avatarUrl" TEXT,
    "admin" BOOLEAN DEFAULT false,
    "reddit_id" VARCHAR,

    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IDX_2d4cb7f2ff3bcc12f0639d8f86" ON "post"("url");

-- CreateIndex
CREATE INDEX "IDX_be5fda3aac270b134ff9c21cde" ON "post"("id");

-- CreateIndex
CREATE INDEX "IDX_94fa9017051b40a71e000a2aff" ON "reply"("id");

-- CreateIndex
CREATE INDEX "IDX_12eee115462e38d62e5455fc05" ON "subject"("id");

-- CreateIndex
CREATE INDEX "IDX_5acc6679899bd3c8c8c0df8380" ON "subject"("url");

-- CreateIndex
CREATE INDEX "IDX_7881a1bb95366970ea4888e8c4" ON "subject"("metadata");

-- CreateIndex
CREATE INDEX "IDX_8a44a076bfdb895141a4984ffd" ON "subject"("uuid");

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "FK_e1b114a8be985356d01aa1095ce" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reply" ADD CONSTRAINT "FK_650bb493bc96cdc1c6a95d50ccd" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reply" ADD CONSTRAINT "FK_e9886d6d04a19413a2f0aac5d7b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "FK_f3d464e642ccfc389de4463d6c9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
