import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703217098530 implements MigrationInterface {
    name = 'Migration1703217098530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_song" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "songHash" varchar NOT NULL, "title" varchar NOT NULL, "artist" varchar NOT NULL, "mapper" varchar NOT NULL, "duration" integer, "bpm" integer, "gameId" integer, "downloadUrl" varchar, "fileReference" varchar, CONSTRAINT "UQ_4f2e03f5d2c2e196a9066538511" UNIQUE ("songHash"), CONSTRAINT "FK_1c4da7f8b290d50dc07a9ca6bab" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_song"("id", "songHash", "title", "artist", "mapper", "duration", "bpm", "gameId", "downloadUrl") SELECT "id", "songHash", "title", "artist", "mapper", "duration", "bpm", "gameId", "downloadUrl" FROM "song"`);
        await queryRunner.query(`DROP TABLE "song"`);
        await queryRunner.query(`ALTER TABLE "temporary_song" RENAME TO "song"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song" RENAME TO "temporary_song"`);
        await queryRunner.query(`CREATE TABLE "song" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "songHash" varchar NOT NULL, "title" varchar NOT NULL, "artist" varchar NOT NULL, "mapper" varchar NOT NULL, "duration" integer, "bpm" integer, "gameId" integer, "downloadUrl" varchar, CONSTRAINT "UQ_4f2e03f5d2c2e196a9066538511" UNIQUE ("songHash"), CONSTRAINT "FK_1c4da7f8b290d50dc07a9ca6bab" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "song"("id", "songHash", "title", "artist", "mapper", "duration", "bpm", "gameId", "downloadUrl") SELECT "id", "songHash", "title", "artist", "mapper", "duration", "bpm", "gameId", "downloadUrl" FROM "temporary_song"`);
        await queryRunner.query(`DROP TABLE "temporary_song"`);
    }

}
