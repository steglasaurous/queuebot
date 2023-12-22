import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { SongRequest } from './song-request.entity';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  songHash: string;
  @Column()
  title: string;
  @Column()
  artist: string;
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
}
