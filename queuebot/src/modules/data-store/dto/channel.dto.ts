import { GameDto } from './game.dto';

export class ChannelDto {
  channelName: string;
  inChannel: boolean;
  enabled: boolean;
  queueOpen: boolean;
  game: GameDto;
}
