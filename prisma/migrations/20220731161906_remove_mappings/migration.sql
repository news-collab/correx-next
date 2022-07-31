-- AlterTable
ALTER TABLE "migrations" RENAME CONSTRAINT "PK_8c82d7f526340ab734260ea46be" TO "migrations_pkey";

-- AlterTable
ALTER TABLE "post" RENAME CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" TO "post_pkey";

-- AlterTable
ALTER TABLE "reply" RENAME CONSTRAINT "PK_94fa9017051b40a71e000a2aff9" TO "reply_pkey";

-- AlterTable
ALTER TABLE "subject" RENAME CONSTRAINT "PK_12eee115462e38d62e5455fc054" TO "subject_pkey";

-- AlterTable
ALTER TABLE "user" RENAME CONSTRAINT "PK_cace4a159ff9f2512dd42373760" TO "user_pkey";

-- RenameForeignKey
ALTER TABLE "post" RENAME CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" TO "post_userId_fkey";

-- RenameForeignKey
ALTER TABLE "post" RENAME CONSTRAINT "FK_e1b114a8be985356d01aa1095ce" TO "post_subjectId_fkey";

-- RenameForeignKey
ALTER TABLE "reply" RENAME CONSTRAINT "FK_650bb493bc96cdc1c6a95d50ccd" TO "reply_postId_fkey";

-- RenameForeignKey
ALTER TABLE "reply" RENAME CONSTRAINT "FK_e9886d6d04a19413a2f0aac5d7b" TO "reply_userId_fkey";

-- RenameForeignKey
ALTER TABLE "subject" RENAME CONSTRAINT "FK_f3d464e642ccfc389de4463d6c9" TO "subject_userId_fkey";

-- RenameIndex
ALTER INDEX "IDX_2d4cb7f2ff3bcc12f0639d8f86" RENAME TO "post_url_idx";

-- RenameIndex
ALTER INDEX "IDX_be5fda3aac270b134ff9c21cde" RENAME TO "post_id_idx";

-- RenameIndex
ALTER INDEX "IDX_94fa9017051b40a71e000a2aff" RENAME TO "reply_id_idx";

-- RenameIndex
ALTER INDEX "IDX_12eee115462e38d62e5455fc05" RENAME TO "subject_id_idx";

-- RenameIndex
ALTER INDEX "IDX_5acc6679899bd3c8c8c0df8380" RENAME TO "subject_url_idx";

-- RenameIndex
ALTER INDEX "IDX_7881a1bb95366970ea4888e8c4" RENAME TO "subject_metadata_idx";

-- RenameIndex
ALTER INDEX "IDX_8a44a076bfdb895141a4984ffd" RENAME TO "subject_uuid_idx";
