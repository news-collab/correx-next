import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserAvatar1602714531253 implements MigrationInterface {
    name = 'addUserAvatar1602714531253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatarUrl" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarUrl"`);
    }

}
