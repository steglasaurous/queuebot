import { Module } from '@nestjs/common';
import { JoinChannelBotCommand } from './commands/join-channel.bot-command';
import { BotCommandListener } from './listeners/bot-command.listener';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataStoreModule } from '../data-store/data-store.module';
import { Channel } from '../data-store/entities/channel.entity';
import { BotStateService } from './services/bot-state.service';
import { SongRequestBotCommand } from './commands/song-request.bot-command';
import { SongStoreModule } from '../song-store/song-store.module';
import { JoinChannelsOnConnectListener } from './listeners/join-channels-on-connect.listener';
import { SongRequestModule } from '../song-request/song-request.module';
import { NextSongBotCommand } from './commands/next-song.bot-command';
import { QueueBotCommand } from './commands/queue.bot-command';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DataStoreModule,
    TypeOrmModule.forFeature([Channel]),
    SongStoreModule,
    SongRequestModule,
  ],
  providers: [
    {
      provide: 'BOT_CHANNEL_NAME',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('TWITCH_CHANNEL');
      },
    },
    JoinChannelBotCommand,
    SongRequestBotCommand,
    NextSongBotCommand,
    QueueBotCommand,
    {
      provide: 'BOT_COMMANDS',
      inject: [
        JoinChannelBotCommand,
        SongRequestBotCommand,
        NextSongBotCommand,
        QueueBotCommand,
      ],
      useFactory: (
        joinChannelBotCommand: JoinChannelBotCommand,
        songRequestBotCommand: SongRequestBotCommand,
        nextSongBotCommand: NextSongBotCommand,
        queueBotCommand: QueueBotCommand,
      ) => {
        return [
          joinChannelBotCommand,
          songRequestBotCommand,
          nextSongBotCommand,
          queueBotCommand,
        ];
      },
    },
    BotCommandListener,
    BotStateService,
    JoinChannelsOnConnectListener,
  ],
})
export class BotCommandsModule {}
