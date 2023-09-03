import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { SongRequest } from './song-request.entity';

@Entity()
export class Channel {
  @PrimaryColumn()
  channelName: string;

  @Column()
  joinedOn: Date;

  @OneToMany(() => SongRequest, (songRequest) => songRequest.channel)
  requests: SongRequest[];
}
