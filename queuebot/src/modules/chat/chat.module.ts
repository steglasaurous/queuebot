import { Module } from '@nestjs/common';
import { ChatManagerService } from './services/chat-manager.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwitchChatClient } from './services/clients/twitch-chat.client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TestChatClient } from './services/clients/test-chat.client';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'ChatClients',
      inject: [ConfigService, EventEmitter2],
      useFactory: (
        configService: ConfigService,
        eventEmitter: EventEmitter2,
      ) => {
        const twitchClient = new TwitchChatClient(
          configService.get('TWITCH_APP_CLIENT_ID'),
          configService.get('TWITCH_APP_CLIENT_SECRET'),
          configService.get('TWITCH_TOKEN_FILE'),
          configService.get('TWITCH_CHANNEL'),
          eventEmitter,
        );

        return [twitchClient];
      },
    },
    ChatManagerService,
    TestChatClient,
  ],
  exports: [ChatManagerService],
})
export class ChatModule {}
