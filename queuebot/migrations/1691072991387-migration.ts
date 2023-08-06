import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1691072991387 implements MigrationInterface {
    name = 'Migration1691072991387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "channel" ("channelName" varchar PRIMARY KEY NOT NULL, "joinedOn" datetime NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "channel"`);
    }

}
