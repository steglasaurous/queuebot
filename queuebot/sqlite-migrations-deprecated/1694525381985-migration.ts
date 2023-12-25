import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1694525381985 implements MigrationInterface {
  name = 'Migration1694525381985';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_game" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "displayName" varchar NOT NULL, "twitchCategoryId" varchar NOT NULL, "setGameName" varchar NOT NULL, CONSTRAINT "UQ_5d1e08e04b97aa06d671cd58409" UNIQUE ("name"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_game"("id", "name", "displayName", "twitchCategoryId", "setGameName") SELECT "id", "name", "displayName", "twitchCategoryId", LOWER("displayName") FROM "game"`,
    );
    await queryRunner.query(`DROP TABLE "game"`);
    await queryRunner.query(`ALTER TABLE "temporary_game" RENAME TO "game"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "game" RENAME TO "temporary_game"`);
    await queryRunner.query(
      `CREATE TABLE "game" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "displayName" varchar NOT NULL, "twitchCategoryId" varchar NOT NULL, CONSTRAINT "UQ_5d1e08e04b97aa06d671cd58409" UNIQUE ("name"))`,
    );
    await queryRunner.query(
      `INSERT INTO "game"("id", "name", "displayName", "twitchCategoryId") SELECT "id", "name", "displayName", "twitchCategoryId" FROM "temporary_game"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_game"`);
  }
}
