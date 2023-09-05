import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { SongRequest } from './song-request.entity';
import { UserBotState } from './user-bot-state.entity';
import { Game } from './game.entity';

@Entity()
export class Channel {
  @PrimaryColumn()
  channelName: string;

  @Column()
  joinedOn: Date;

  @OneToMany(() => SongRequest, (songRequest) => songRequest.channel)
  requests: SongRequest[];

  @OneToMany(() => UserBotState, (userBotState) => userBotState.channel, {
    nullable: true,
  })
  userBotStates: UserBotState[];

  @ManyToOne(() => Game, (game) => game.channels)
  game?: Game;

  @Column({ default: 'en' })
  lang: string;
}
