import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Song } from './song.entity';
import { Channel } from './channel.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  displayName: string;

  @Column()
  twitchCategoryId: string;
  @OneToMany(() => Song, (song) => song.requests)
  songs: Song[];

  @OneToMany(() => Channel, (channel) => channel.game)
  channels: Channel[];
}
