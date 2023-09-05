import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1693843419830 implements MigrationInterface {
    name = 'Migration1693843419830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_bot_state" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "state" text, "timestamp" integer NOT NULL, "channelChannelName" varchar)`);
        await queryRunner.query(`CREATE TABLE "temporary_user_bot_state" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "state" text, "timestamp" integer NOT NULL, "channelChannelName" varchar, CONSTRAINT "FK_ab77da784b7259850927bacf51c" FOREIGN KEY ("channelChannelName") REFERENCES "channel" ("channelName") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user_bot_state"("id", "requesterName", "state", "timestamp", "channelChannelName") SELECT "id", "requesterName", "state", "timestamp", "channelChannelName" FROM "user_bot_state"`);
        await queryRunner.query(`DROP TABLE "user_bot_state"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_bot_state" RENAME TO "user_bot_state"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_bot_state" RENAME TO "temporary_user_bot_state"`);
        await queryRunner.query(`CREATE TABLE "user_bot_state" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "state" text, "timestamp" integer NOT NULL, "channelChannelName" varchar)`);
        await queryRunner.query(`INSERT INTO "user_bot_state"("id", "requesterName", "state", "timestamp", "channelChannelName") SELECT "id", "requesterName", "state", "timestamp", "channelChannelName" FROM "temporary_user_bot_state"`);
        await queryRunner.query(`DROP TABLE "temporary_user_bot_state"`);
        await queryRunner.query(`DROP TABLE "user_bot_state"`);
    }

}
