import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { SongRequest } from './song-request.entity';

@Entity()
// Ignoring the full text search index since it's not directly supported by
// typeorm - have to manage it manually.
// https://orkhan.gitbook.io/typeorm/docs/indices#disabling-synchronization
@Index('songSearchIdx', { synchronize: false })
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * A hash or any string that serves as a unique identifier for this song within a game.
   */
  @Column({ unique: true })
  songHash: string;
  @Column()
  title: string;
  @Column({ nullable: true })
  artist?: string;
  @Column()
  mapper: string;
  @Column({ nullable: true })
  duration?: number;
  @Column({ nullable: true })
  bpm?: number;

  @Column({ nullable: true })
  downloadUrl?: string;

  /**
   * If available, stores a reference of some sort (dependent on the source) that can
   * be used by a downloader to determine whether or not to download the song. (ex: auto-download song on request)
   *
   * Most useful for Spin Rhythm where links don't contain the actual file downloaded, but the file reference is the same
   * name as the .srtb filename, and can be used to check if the song already exists on the user's computer.
   */
  @Column({ nullable: true })
  fileReference: string;

  @ManyToOne(() => Game, (game) => game.songs, { eager: true })
  game: Game;

  @OneToMany(() => SongRequest, (songRequest) => songRequest.song)
  requests: SongRequest[];

  @Column({
    generatedType: 'STORED',
    asExpression: `to_tsvector('english', coalesce(title, '') || ' ' || coalesce(artist, '') || ' ' || coalesce(mapper, ''))`,
    type: 'tsvector',
  })
  songSearch: string;
}
