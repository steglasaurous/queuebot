import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1693840436334 implements MigrationInterface {
  name = 'Migration1693840436334';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO game (name, displayName) VALUES ('audio_trip', 'Audio Trip')",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DELETE FROM game where name = 'audio-trip'");
  }
}
