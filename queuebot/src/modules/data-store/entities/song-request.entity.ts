import { Song } from './song.entity';
import { Channel } from './channel.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['channel', 'song'])
export class SongRequest {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Song, (song) => song.requests, { eager: true })
  song: Song;
  @Column()
  requesterName: string;
  @Column()
  requestTimestamp: number;
  @Column()
  requestOrder: number;
  @ManyToOne(() => Channel, (channel) => channel.requests, { eager: true })
  channel: Channel;
}
