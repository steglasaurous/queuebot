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

  @ManyToOne(() => Song, (song) => song.requests, {
    eager: true,
    nullable: false,
  })
  song: Song;

  @Column()
  requesterName: string;

  @Column({ type: 'timestamptz' })
  requestTimestamp: Date;

  @Column()
  requestOrder: number;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isDone: boolean;

  @ManyToOne(() => Channel, (channel) => channel.requests, {
    eager: true,
    nullable: false,
  })
  channel: Channel;
}
