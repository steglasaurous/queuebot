import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694283902832 implements MigrationInterface {
    name = 'Migration1694283902832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_channel" ("channelName" varchar PRIMARY KEY NOT NULL, "joinedOn" datetime NOT NULL, "lang" varchar NOT NULL DEFAULT ('en'), "gameId" integer, "inChannel" boolean NOT NULL, "enabled" boolean NOT NULL, "leftOn" datetime NOT NULL, CONSTRAINT "FK_d87d7370a6433219a9b73982070" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_channel"("channelName", "joinedOn", "lang", "gameId", "inChannel", "enabled", "leftOn") SELECT "channelName", "joinedOn", "lang", "gameId", "inChannel", "enabled", "leftOn" FROM "channel"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`ALTER TABLE "temporary_channel" RENAME TO "channel"`);
        await queryRunner.query(`CREATE TABLE "temporary_channel" ("channelName" varchar PRIMARY KEY NOT NULL, "joinedOn" datetime NOT NULL, "lang" varchar NOT NULL DEFAULT ('en'), "gameId" integer, "inChannel" boolean NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "leftOn" datetime, CONSTRAINT "FK_d87d7370a6433219a9b73982070" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_channel"("channelName", "joinedOn", "lang", "gameId", "inChannel", "enabled", "leftOn") SELECT "channelName", "joinedOn", "lang", "gameId", "inChannel", "enabled", "leftOn" FROM "channel"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`ALTER TABLE "temporary_channel" RENAME TO "channel"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" RENAME TO "temporary_channel"`);
        await queryRunner.query(`CREATE TABLE "channel" ("channelName" varchar PRIMARY KEY NOT NULL, "joinedOn" datetime NOT NULL, "lang" varchar NOT NULL DEFAULT ('en'), "gameId" integer, "inChannel" boolean NOT NULL, "enabled" boolean NOT NULL, "leftOn" datetime NOT NULL, CONSTRAINT "FK_d87d7370a6433219a9b73982070" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "channel"("channelName", "joinedOn", "lang", "gameId", "inChannel", "enabled", "leftOn") SELECT "channelName", "joinedOn", "lang", "gameId", "inChannel", "enabled", "leftOn" FROM "temporary_channel"`);
        await queryRunner.query(`DROP TABLE "temporary_channel"`);
        await queryRunner.query(`ALTER TABLE "channel" RENAME TO "temporary_channel"`);
        await queryRunner.query(`CREATE TABLE "channel" ("channelName" varchar PRIMARY KEY NOT NULL, "joinedOn" datetime NOT NULL, "lang" varchar NOT NULL DEFAULT ('en'), "gameId" integer, "inChannel" boolean NOT NULL, "enabled" boolean NOT NULL, "leftOn" datetime NOT NULL, CONSTRAINT "FK_d87d7370a6433219a9b73982070" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "channel"("channelName", "joinedOn", "lang", "gameId", "inChannel", "enabled", "leftOn") SELECT "channelName", "joinedOn", "lang", "gameId", "inChannel", "enabled", "leftOn" FROM "temporary_channel"`);
        await queryRunner.query(`DROP TABLE "temporary_channel"`);
    }

}
