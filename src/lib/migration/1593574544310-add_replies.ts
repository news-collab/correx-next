import {MigrationInterface, QueryRunner} from "typeorm";

export class addReplies1593574544310 implements MigrationInterface {
    name = 'addReplies1593574544310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "reply_platform_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "reply" ("id" SERIAL NOT NULL, "platform" "reply_platform_enum" NOT NULL DEFAULT '0', "platformId" character varying NOT NULL, "data" jsonb NOT NULL, "postId" integer, "userId" integer, CONSTRAINT "PK_94fa9017051b40a71e000a2aff9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_94fa9017051b40a71e000a2aff" ON "reply" ("id") `);
        await queryRunner.query(`ALTER TABLE "reply" ADD CONSTRAINT "FK_650bb493bc96cdc1c6a95d50ccd" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reply" ADD CONSTRAINT "FK_e9886d6d04a19413a2f0aac5d7b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_e9886d6d04a19413a2f0aac5d7b"`);
        await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_650bb493bc96cdc1c6a95d50ccd"`);
        await queryRunner.query(`DROP INDEX "IDX_94fa9017051b40a71e000a2aff"`);
        await queryRunner.query(`DROP TABLE "reply"`);
        await queryRunner.query(`DROP TYPE "reply_platform_enum"`);
    }

}
