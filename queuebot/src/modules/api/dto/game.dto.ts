import { GameDto as GameDtoInterface } from '../../../../../common';
import { ApiProperty } from '@nestjs/swagger';

export class GameDto implements GameDtoInterface {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  setGameName: string;

  @ApiProperty()
  twitchCategoryId: string;
}
