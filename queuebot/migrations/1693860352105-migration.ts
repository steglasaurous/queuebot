import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1693860352105 implements MigrationInterface {
    name = 'Migration1693860352105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_channel" ("channelName" varchar PRIMARY KEY NOT NULL, "joinedOn" datetime NOT NULL, "lang" varchar NOT NULL DEFAULT ('en'), "gameId" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_channel"("channelName", "joinedOn") SELECT "channelName", "joinedOn" FROM "channel"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`ALTER TABLE "temporary_channel" RENAME TO "channel"`);
        await queryRunner.query(`CREATE TABLE "temporary_channel" ("channelName" varchar PRIMARY KEY NOT NULL, "joinedOn" datetime NOT NULL, "lang" varchar NOT NULL DEFAULT ('en'), "gameId" integer, CONSTRAINT "FK_d87d7370a6433219a9b73982070" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_channel"("channelName", "joinedOn", "lang", "gameId") SELECT "channelName", "joinedOn", "lang", "gameId" FROM "channel"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`ALTER TABLE "temporary_channel" RENAME TO "channel"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" RENAME TO "temporary_channel"`);
        await queryRunner.query(`CREATE TABLE "channel" ("channelName" varchar PRIMARY KEY NOT NULL, "joinedOn" datetime NOT NULL, "lang" varchar NOT NULL DEFAULT ('en'), "gameId" integer)`);
        await queryRunner.query(`INSERT INTO "channel"("channelName", "joinedOn", "lang", "gameId") SELECT "channelName", "joinedOn", "lang", "gameId" FROM "temporary_channel"`);
        await queryRunner.query(`DROP TABLE "temporary_channel"`);
        await queryRunner.query(`ALTER TABLE "channel" RENAME TO "temporary_channel"`);
        await queryRunner.query(`CREATE TABLE "channel" ("channelName" varchar PRIMARY KEY NOT NULL, "joinedOn" datetime NOT NULL)`);
        await queryRunner.query(`INSERT INTO "channel"("channelName", "joinedOn") SELECT "channelName", "joinedOn" FROM "temporary_channel"`);
        await queryRunner.query(`DROP TABLE "temporary_channel"`);
    }

}
