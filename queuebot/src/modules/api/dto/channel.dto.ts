import { GameDto } from '../../../../../common';
import { ChannelDto as ChannelDtoInterface } from '../../../../../common/queuebot-dto/channel.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ChannelDto implements ChannelDtoInterface {
  @ApiProperty()
  channelName: string;
  @ApiProperty({
    description:
      'Indicates whether the bot is, or should be, present in this channel',
  })
  inChannel: boolean;
  @ApiProperty({
    description:
      'Indicates whether the bot is enabled or not in the channel (using !requestobot off or !requestobot on)',
  })
  enabled: boolean;
  @ApiProperty()
  queueOpen: boolean;
  @ApiProperty()
  game: GameDto;
}
