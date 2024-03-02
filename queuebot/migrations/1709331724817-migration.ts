import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1709331724817 implements MigrationInterface {
    name = 'Migration1709331724817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song_request" ADD "requestPriority" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song_request" DROP COLUMN "requestPriority"`);
    }

}
