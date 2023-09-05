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
  @ManyToOne(() => Game, (game) => game.songs)
  game: Game;

  @OneToMany(() => SongRequest, (songRequest) => songRequest.song)
  requests: SongRequest[];
}