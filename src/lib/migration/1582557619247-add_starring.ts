import {MigrationInterface, QueryRunner} from "typeorm";

export class addStarring1582557619247 implements MigrationInterface {
    name = 'addStarring1582557619247'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "post" ADD "starred" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "post" ADD "userId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`, undefined);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "userId"`, undefined);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "starred"`, undefined);
    }

}
