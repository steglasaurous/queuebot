import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Game } from './entities/game.entity';
import { Song } from './entities/song.entity';
import { SongRequest } from './entities/song-request.entity';
import { UserBotState } from './entities/user-bot-state.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, Game, Song, SongRequest, UserBotState]),
  ],
  exports: [TypeOrmModule],
})
export class DataStoreModule {}
