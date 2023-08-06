import { Module } from '@nestjs/common';
import { ChatManagerService } from './services/chat-manager.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwitchChatClient } from './services/clients/twitch-chat.client';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: "ChatClients",
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const twitchClient = new TwitchChatClient(
                    configService.get('TWITCH_APP_CLIENT_ID'),
                    configService.get('TWITCH_APP_CLIENT_SECRET'),
                    configService.get('TWITCH_TOKEN_FILE'),
                    configService.get('TWITCH_CHANNEL'),
                );

                return [twitchClient];
            }
        },
        ChatManagerService,
    ],
    exports: [ChatManagerService],
})
export class ChatModule {}
