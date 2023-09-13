import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { SongRequest } from './song-request.entity';
import { UserBotState } from './user-bot-state.entity';
import { Game } from './game.entity';

@Entity()
export class Channel {
  @PrimaryColumn()
  channelName: string;

  /**
   * If true, indicates it is in the channel (and/or should join this channel)
   */
  @Column()
  inChannel: boolean;

  /**
   * Indicate whether the bot is enabled in this channel. (for keeping the bot around, but not have it respond to commands)
   */
  @Column({ default: true })
  enabled: boolean;

  /**
   * When the bot last joined the channel (i.e. was last invited via !join command)
   */
  @Column()
  joinedOn: Date;

  @Column({ default: true })
  queueOpen: boolean;

  /**
   * When the bot was last asked to leave via !getout
   */
  @Column({ nullable: true })
  leftOn?: Date;

  @OneToMany(() => SongRequest, (songRequest) => songRequest.channel)
  requests: SongRequest[];

  @OneToMany(() => UserBotState, (userBotState) => userBotState.channel, {
    nullable: true,
  })
  userBotStates: UserBotState[];

  /**
   * If populated, this is the game it should search song requests for.  If null, the bot is effectively disabled.
   */
  @ManyToOne(() => Game, (game) => game.channels, { eager: true })
  game?: Game;

  /**
   * The language to use when sending chat messages. Defaults to English.
   */
  @Column({ default: 'en' })
  lang: string;
}
