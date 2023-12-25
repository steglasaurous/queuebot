import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694269783271 implements MigrationInterface {
    name = 'Migration1694269783271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "displayName" varchar NOT NULL, "twitchCategoryId" varchar NOT NULL, CONSTRAINT "UQ_5d1e08e04b97aa06d671cd58409" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "song" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "songHash" varchar NOT NULL, "title" varchar NOT NULL, "artist" varchar NOT NULL, "mapper" varchar NOT NULL, "duration" integer, "bpm" integer, "gameId" integer, CONSTRAINT "UQ_4f2e03f5d2c2e196a9066538511" UNIQUE ("songHash"))`);
        await queryRunner.query(`CREATE TABLE "song_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "requestTimestamp" integer NOT NULL, "requestOrder" integer NOT NULL, "songId" integer, "channelChannelName" varchar, CONSTRAINT "UQ_db0193cbefd39db62bbd46a212d" UNIQUE ("channelChannelName", "songId"))`);
        await queryRunner.query(`CREATE TABLE "user_bot_state" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "state" text, "timestamp" integer NOT NULL, "channelChannelName" varchar)`);
        await queryRunner.query(`CREATE TABLE "channel" ("channelName" varchar PRIMARY KEY NOT NULL, "joinedOn" datetime NOT NULL, "lang" varchar NOT NULL DEFAULT ('en'), "gameId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_song" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "songHash" varchar NOT NULL, "title" varchar NOT NULL, "artist" varchar NOT NULL, "mapper" varchar NOT NULL, "duration" integer, "bpm" integer, "gameId" integer, CONSTRAINT "UQ_4f2e03f5d2c2e196a9066538511" UNIQUE ("songHash"), CONSTRAINT "FK_1c4da7f8b290d50dc07a9ca6bab" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_song"("id", "songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") SELECT "id", "songHash", "title", "artist", "mapper", "duration", "bpm", "gameId" FROM "song"`);
        await queryRunner.query(`DROP TABLE "song"`);
        await queryRunner.query(`ALTER TABLE "temporary_song" RENAME TO "song"`);
        await queryRunner.query(`CREATE TABLE "temporary_song_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "requestTimestamp" integer NOT NULL, "requestOrder" integer NOT NULL, "songId" integer, "channelChannelName" varchar, CONSTRAINT "UQ_db0193cbefd39db62bbd46a212d" UNIQUE ("channelChannelName", "songId"), CONSTRAINT "FK_4af173bdba31c1f42b5398add20" FOREIGN KEY ("songId") REFERENCES "song" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_3bbf4ded0801d7055cd0d5473aa" FOREIGN KEY ("channelChannelName") REFERENCES "channel" ("channelName") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_song_request"("id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName") SELECT "id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName" FROM "song_request"`);
        await queryRunner.query(`DROP TABLE "song_request"`);
        await queryRunner.query(`ALTER TABLE "temporary_song_request" RENAME TO "song_request"`);
        await queryRunner.query(`CREATE TABLE "temporary_user_bot_state" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "state" text, "timestamp" integer NOT NULL, "channelChannelName" varchar, CONSTRAINT "FK_ab77da784b7259850927bacf51c" FOREIGN KEY ("channelChannelName") REFERENCES "channel" ("channelName") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user_bot_state"("id", "requesterName", "state", "timestamp", "channelChannelName") SELECT "id", "requesterName", "state", "timestamp", "channelChannelName" FROM "user_bot_state"`);
        await queryRunner.query(`DROP TABLE "user_bot_state"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_bot_state" RENAME TO "user_bot_state"`);
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
        await queryRunner.query(`ALTER TABLE "user_bot_state" RENAME TO "temporary_user_bot_state"`);
        await queryRunner.query(`CREATE TABLE "user_bot_state" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "state" text, "timestamp" integer NOT NULL, "channelChannelName" varchar)`);
        await queryRunner.query(`INSERT INTO "user_bot_state"("id", "requesterName", "state", "timestamp", "channelChannelName") SELECT "id", "requesterName", "state", "timestamp", "channelChannelName" FROM "temporary_user_bot_state"`);
        await queryRunner.query(`DROP TABLE "temporary_user_bot_state"`);
        await queryRunner.query(`ALTER TABLE "song_request" RENAME TO "temporary_song_request"`);
        await queryRunner.query(`CREATE TABLE "song_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "requestTimestamp" integer NOT NULL, "requestOrder" integer NOT NULL, "songId" integer, "channelChannelName" varchar, CONSTRAINT "UQ_db0193cbefd39db62bbd46a212d" UNIQUE ("channelChannelName", "songId"))`);
        await queryRunner.query(`INSERT INTO "song_request"("id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName") SELECT "id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName" FROM "temporary_song_request"`);
        await queryRunner.query(`DROP TABLE "temporary_song_request"`);
        await queryRunner.query(`ALTER TABLE "song" RENAME TO "temporary_song"`);
        await queryRunner.query(`CREATE TABLE "song" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "songHash" varchar NOT NULL, "title" varchar NOT NULL, "artist" varchar NOT NULL, "mapper" varchar NOT NULL, "duration" integer, "bpm" integer, "gameId" integer, CONSTRAINT "UQ_4f2e03f5d2c2e196a9066538511" UNIQUE ("songHash"))`);
        await queryRunner.query(`INSERT INTO "song"("id", "songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") SELECT "id", "songHash", "title", "artist", "mapper", "duration", "bpm", "gameId" FROM "temporary_song"`);
        await queryRunner.query(`DROP TABLE "temporary_song"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`DROP TABLE "user_bot_state"`);
        await queryRunner.query(`DROP TABLE "song_request"`);
        await queryRunner.query(`DROP TABLE "song"`);
        await queryRunner.query(`DROP TABLE "game"`);
    }

}
