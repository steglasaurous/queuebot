import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1696022219356 implements MigrationInterface {
    name = 'Migration1696022219356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_auth_source" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "authSource" varchar NOT NULL, "authSourceUserId" varchar NOT NULL, "authSourceProfileData" text, "userId" integer, CONSTRAINT "UQ_15e21e7f29b09b5df04adde421e" UNIQUE ("userId", "authSource"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "displayName" varchar NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`);
        await queryRunner.query(`CREATE TABLE "temporary_user_auth_source" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "authSource" varchar NOT NULL, "authSourceUserId" varchar NOT NULL, "authSourceProfileData" text, "userId" integer, CONSTRAINT "UQ_15e21e7f29b09b5df04adde421e" UNIQUE ("userId", "authSource"), CONSTRAINT "FK_2d0e40a8d133066614dd2c22e9c" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user_auth_source"("id", "authSource", "authSourceUserId", "authSourceProfileData", "userId") SELECT "id", "authSource", "authSourceUserId", "authSourceProfileData", "userId" FROM "user_auth_source"`);
        await queryRunner.query(`DROP TABLE "user_auth_source"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_auth_source" RENAME TO "user_auth_source"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_auth_source" RENAME TO "temporary_user_auth_source"`);
        await queryRunner.query(`CREATE TABLE "user_auth_source" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "authSource" varchar NOT NULL, "authSourceUserId" varchar NOT NULL, "authSourceProfileData" text, "userId" integer, CONSTRAINT "UQ_15e21e7f29b09b5df04adde421e" UNIQUE ("userId", "authSource"))`);
        await queryRunner.query(`INSERT INTO "user_auth_source"("id", "authSource", "authSourceUserId", "authSourceProfileData", "userId") SELECT "id", "authSource", "authSourceUserId", "authSourceProfileData", "userId" FROM "temporary_user_auth_source"`);
        await queryRunner.query(`DROP TABLE "temporary_user_auth_source"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_auth_source"`);
    }

}
