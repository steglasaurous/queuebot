import { Song } from './song.entity';
import { Channel } from './channel.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SongRequest {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Song, (song) => song.requests)
  song: Song;
  @Column()
  requesterName: string;
  @Column()
  requestTimestamp: number;
  @Column()
  requestOrder: number;
  @ManyToOne(() => Channel, (channel) => channel.requests)
  channel: Channel;
}
