import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Game } from './entities/game.entity';
import { Song } from './entities/song.entity';
import { SongRequest } from './entities/song-request.entity';
import { UserBotState } from './entities/user-bot-state.entity';
import { DtoMappingService } from './services/dto-mapping.service';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { UserAuthSource } from './entities/user-auth-source.entity';
import { SettingService } from './services/setting.service';
import { SettingDefinition } from './entities/setting-definition.entity';
import { Setting } from './entities/setting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channel,
      Game,
      Song,
      SongRequest,
      UserBotState,
      User,
      UserAuthSource,
      Setting,
      SettingDefinition,
    ]),
  ],
  exports: [TypeOrmModule, DtoMappingService, UserService, SettingService],
  providers: [DtoMappingService, UserService, SettingService],
})
export class DataStoreModule {}
