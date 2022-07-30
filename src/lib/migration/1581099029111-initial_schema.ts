import {MigrationInterface, QueryRunner} from "typeorm";

export class initialSchema1581099029111 implements MigrationInterface {
    name = 'initialSchema1581099029111'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "twitterId" character varying NOT NULL, "name" character varying NOT NULL, "screenname" character varying NOT NULL, "description" character varying NOT NULL, "verified" boolean NOT NULL, "twitterCreatedAt" TIMESTAMP NOT NULL, "token" character varying NOT NULL, "tokenSecret" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "subject" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "uuid" character varying NOT NULL, "metadata" jsonb NOT NULL DEFAULT '{}', "userId" integer, CONSTRAINT "PK_12eee115462e38d62e5455fc054" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_12eee115462e38d62e5455fc05" ON "subject" ("id") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_5acc6679899bd3c8c8c0df8380" ON "subject" ("url") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_8a44a076bfdb895141a4984ffd" ON "subject" ("uuid") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_7881a1bb95366970ea4888e8c4" ON "subject" ("metadata") `, undefined);
        await queryRunner.query(`CREATE TYPE "post_platform_enum" AS ENUM('0', '1')`, undefined);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "platform" "post_platform_enum" NOT NULL DEFAULT '0', "platformId" character varying NOT NULL, "url" character varying NOT NULL, "data" jsonb NOT NULL, "subjectId" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_be5fda3aac270b134ff9c21cde" ON "post" ("id") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_2d4cb7f2ff3bcc12f0639d8f86" ON "post" ("url") `, undefined);
        await queryRunner.query(`ALTER TABLE "subject" ADD CONSTRAINT "FK_f3d464e642ccfc389de4463d6c9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_e1b114a8be985356d01aa1095ce" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_e1b114a8be985356d01aa1095ce"`, undefined);
        await queryRunner.query(`ALTER TABLE "subject" DROP CONSTRAINT "FK_f3d464e642ccfc389de4463d6c9"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_2d4cb7f2ff3bcc12f0639d8f86"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_be5fda3aac270b134ff9c21cde"`, undefined);
        await queryRunner.query(`DROP TABLE "post"`, undefined);
        await queryRunner.query(`DROP TYPE "post_platform_enum"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_7881a1bb95366970ea4888e8c4"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_8a44a076bfdb895141a4984ffd"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_5acc6679899bd3c8c8c0df8380"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_12eee115462e38d62e5455fc05"`, undefined);
        await queryRunner.query(`DROP TABLE "subject"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
    }

}
