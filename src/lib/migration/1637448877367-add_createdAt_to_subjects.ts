import { MigrationInterface, QueryRunner } from "typeorm";

export class addCreatedAtToSubjects1637448877367 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subject" ADD "createdAt" timestamp default now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subject" DROP COLUMN "createdAt"`);
    }

}
