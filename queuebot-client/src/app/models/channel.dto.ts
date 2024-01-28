import { GameDto } from './game.dto';

export interface ChannelDto {
  channelName: string;
  inChannel: boolean;
  enabled: boolean;
  queueOpen: boolean;
  game: GameDto;
}
