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
import { OopsBotCommand } from './commands/oops.bot-command';
import { GetOutBotCommand } from './commands/get-out.bot-command';
import { MessageFormatterService } from './services/message-formatter.service';
import { SetGameBotCommand } from './commands/set-game.bot-command';
import { HttpModule } from '@nestjs/axios';
import { OffBotCommand } from './commands/off.bot.command';
import { OnBotCommand } from './commands/on.bot-command';
import { ClearBotCommand } from './commands/clear.bot-command';
import { OpenBotCommand } from './commands/open.bot-command';
import { CloseBotCommand } from './commands/close.bot-command';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DataStoreModule,
    TypeOrmModule.forFeature([Channel]),
    SongStoreModule,
    SongRequestModule,
    HttpModule,
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
    OopsBotCommand,
    GetOutBotCommand,
    SetGameBotCommand,
    OffBotCommand,
    OnBotCommand,
    ClearBotCommand,
    OpenBotCommand,
    CloseBotCommand,
    {
      provide: 'BOT_COMMANDS',
      inject: [
        JoinChannelBotCommand,
        SongRequestBotCommand,
        NextSongBotCommand,
        QueueBotCommand,
        OopsBotCommand,
        GetOutBotCommand,
        SetGameBotCommand,
        OffBotCommand,
        OnBotCommand,
        ClearBotCommand,
        OpenBotCommand,
        CloseBotCommand,
      ],
      useFactory: (
        joinChannelBotCommand: JoinChannelBotCommand,
        songRequestBotCommand: SongRequestBotCommand,
        nextSongBotCommand: NextSongBotCommand,
        queueBotCommand: QueueBotCommand,
        oopsBotCommand: OopsBotCommand,
        getOutBotCommand: GetOutBotCommand,
        setGameBotCommand: SetGameBotCommand,
        offBotCommand: OffBotCommand,
        onBotCommand: OnBotCommand,
        clearBotCommand: ClearBotCommand,
        openBotCommand: OpenBotCommand,
        closeBotCommand: CloseBotCommand,
      ) => {
        return [
          joinChannelBotCommand,
          songRequestBotCommand,
          nextSongBotCommand,
          queueBotCommand,
          oopsBotCommand,
          getOutBotCommand,
          setGameBotCommand,
          offBotCommand,
          onBotCommand,
          clearBotCommand,
          openBotCommand,
          closeBotCommand,
        ];
      },
    },
    BotCommandListener,
    BotStateService,
    JoinChannelsOnConnectListener,
    MessageFormatterService,
  ],
})
export class BotCommandsModule {}
