import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1693744003581 implements MigrationInterface {
  name = 'Migration1693744003581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "displayName" varchar NOT NULL, CONSTRAINT "UQ_5d1e08e04b97aa06d671cd58409" UNIQUE ("name"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "song" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "songHash" varchar NOT NULL, "title" varchar NOT NULL, "artist" varchar NOT NULL, "mapper" varchar NOT NULL, "gameId" integer, CONSTRAINT "UQ_4f2e03f5d2c2e196a9066538511" UNIQUE ("songHash"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "song_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "requestTimestamp" integer NOT NULL, "requestOrder" integer NOT NULL, "songId" integer, "channelChannelName" varchar)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_song" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "songHash" varchar NOT NULL, "title" varchar NOT NULL, "artist" varchar NOT NULL, "mapper" varchar NOT NULL, "gameId" integer, CONSTRAINT "UQ_4f2e03f5d2c2e196a9066538511" UNIQUE ("songHash"), CONSTRAINT "FK_1c4da7f8b290d50dc07a9ca6bab" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_song"("id", "songHash", "title", "artist", "mapper", "gameId") SELECT "id", "songHash", "title", "artist", "mapper", "gameId" FROM "song"`,
    );
    await queryRunner.query(`DROP TABLE "song"`);
    await queryRunner.query(`ALTER TABLE "temporary_song" RENAME TO "song"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_song_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "requestTimestamp" integer NOT NULL, "requestOrder" integer NOT NULL, "songId" integer, "channelChannelName" varchar, CONSTRAINT "FK_4af173bdba31c1f42b5398add20" FOREIGN KEY ("songId") REFERENCES "song" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_3bbf4ded0801d7055cd0d5473aa" FOREIGN KEY ("channelChannelName") REFERENCES "channel" ("channelName") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_song_request"("id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName") SELECT "id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName" FROM "song_request"`,
    );
    await queryRunner.query(`DROP TABLE "song_request"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_song_request" RENAME TO "song_request"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "song_request" RENAME TO "temporary_song_request"`,
    );
    await queryRunner.query(
      `CREATE TABLE "song_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "requesterName" varchar NOT NULL, "requestTimestamp" integer NOT NULL, "requestOrder" integer NOT NULL, "songId" integer, "channelChannelName" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "song_request"("id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName") SELECT "id", "requesterName", "requestTimestamp", "requestOrder", "songId", "channelChannelName" FROM "temporary_song_request"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_song_request"`);
    await queryRunner.query(`ALTER TABLE "song" RENAME TO "temporary_song"`);
    await queryRunner.query(
      `CREATE TABLE "song" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "songHash" varchar NOT NULL, "title" varchar NOT NULL, "artist" varchar NOT NULL, "mapper" varchar NOT NULL, "gameId" integer, CONSTRAINT "UQ_4f2e03f5d2c2e196a9066538511" UNIQUE ("songHash"))`,
    );
    await queryRunner.query(
      `INSERT INTO "song"("id", "songHash", "title", "artist", "mapper", "gameId") SELECT "id", "songHash", "title", "artist", "mapper", "gameId" FROM "temporary_song"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_song"`);
    await queryRunner.query(`DROP TABLE "song_request"`);
    await queryRunner.query(`DROP TABLE "song"`);
    await queryRunner.query(`DROP TABLE "game"`);
  }
}
