import { Module } from '@nestjs/common';
import { SongRequestsController } from './controllers/song-requests.controller';
import { SongRequestModule } from '../song-request/song-request.module';
import { DataStoreModule } from '../data-store/data-store.module';
import { ChannelController } from './controllers/channel.controller';
import { AuthModule } from '../auth/auth.module';
import { ChatModule } from '../chat/chat.module';
import { GameController } from './controllers/game.controller';

@Module({
  imports: [SongRequestModule, DataStoreModule, AuthModule, ChatModule],
  controllers: [SongRequestsController, ChannelController, GameController],
})
export class ApiModule {}
