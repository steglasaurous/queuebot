import { Module } from '@nestjs/common';
import {JoinChannelBotCommand} from "./commands/join-channel.bot-command";
import {BotCommandListener} from "./listeners/bot-command.listener";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DataStoreModule} from "../data-store/data-store.module";
import {Channel} from "../data-store/entities/channel.entity";

@Module({
    imports: [
        ConfigModule.forRoot(),
        DataStoreModule,
        TypeOrmModule.forFeature([Channel])
    ],
    providers: [
        {
            provide: 'BOT_CHANNEL_NAME',
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return configService.get('TWITCH_CHANNEL');
            }
        },
        JoinChannelBotCommand,
        {
            provide: 'BOT_COMMANDS',
            inject: [JoinChannelBotCommand],
            useFactory: (joinChannelBotCommand: JoinChannelBotCommand) => {
                return [
                    joinChannelBotCommand
                ];
            }
        },
        BotCommandListener,
    ]
})
export class BotCommandsModule {

}
