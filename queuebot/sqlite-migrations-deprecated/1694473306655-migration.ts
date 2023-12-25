import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1694473306655 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO game (name, displayName, twitchCategoryId) VALUES ('spin_rhythm', 'Spin Rhythm XD', '514201')",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DELETE FROM game WHERE name = 'spin_rhythm'");
  }
}
