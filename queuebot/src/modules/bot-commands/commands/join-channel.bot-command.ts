import {BotCommandInterface} from "./bot-command.interface";
import {ChatMessage} from "../../chat/services/chat-message";
import {Inject, Injectable, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Channel} from "../../data-store/entities/channel.entity";
import {Repository} from "typeorm";

@Injectable()
export class JoinChannelBotCommand implements BotCommandInterface {
    private logger: Logger = new Logger(JoinChannelBotCommand.name);

    constructor(
        @Inject('BOT_CHANNEL_NAME') private botChannelName: string,
        @InjectRepository(Channel) private channelRepository: Repository<Channel>
    ) {
    }

    async execute(chatMessage: ChatMessage): Promise<void> {
        this.logger.debug('Starting join channel command');
        // Check if channel is in the db list, add it if necessary.
        let channelNameEntity = await this.channelRepository.findOneBy({
            channelName: chatMessage.username
        });
        if (!channelNameEntity) {
            channelNameEntity = new Channel();
            channelNameEntity.channelName = chatMessage.username;
            channelNameEntity.joinedOn = new Date();
            await this.channelRepository.save(channelNameEntity);
            this.logger.debug('Saved channel to database', { channelName: channelNameEntity.channelName});
        }
        this.logger.debug('Joining channel', { channelName: channelNameEntity.channelName});
        // Instruct the twitch connection to join the channel.
        await chatMessage.client.joinChannel(channelNameEntity.channelName);
        this.logger.debug('Joined channel', { channelName: channelNameEntity.channelName});

        return Promise.resolve();
    }

    matchesTrigger(chatMessage: ChatMessage): boolean {
        // Should only match the !join command from the bot's channel.
        return chatMessage.channelName == this.botChannelName && chatMessage.message == '!join';
    }
}