import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703552537118 implements MigrationInterface {
    name = 'Migration1703552537118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_bot_state" DROP COLUMN "timestamp"`);
        await queryRunner.query(`ALTER TABLE "user_bot_state" ADD "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_bot_state" DROP COLUMN "timestamp"`);
        await queryRunner.query(`ALTER TABLE "user_bot_state" ADD "timestamp" integer NOT NULL`);
    }

}
