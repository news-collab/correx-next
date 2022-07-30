import { MigrationInterface, QueryRunner } from "typeorm";

export class makeUserTokensOptional1637294306464 implements MigrationInterface {
    name = 'makeUserTokensOptional1637294306464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" ALTER COLUMN "token" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ALTER COLUMN "tokenSecret" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" ALTER COLUMN "token" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ALTER COLUMN "tokenSecret" SET NOT NULL`);
    }

}
