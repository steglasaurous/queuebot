import { BotCommandInterface } from './bot-command.interface';
import { ChatMessage } from '../../chat/services/chat-message';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { Game } from '../../data-store/entities/game.entity';
import { MessageFormatterService } from '../services/message-formatter.service';
import { BaseBotCommand } from './base.bot-command';
// import { I18nTranslations } from '../../../generated/i18n.generated';

@Injectable()
export class JoinChannelBotCommand extends BaseBotCommand {
  private logger: Logger = new Logger(JoinChannelBotCommand.name);

  constructor(
    @Inject('BOT_CHANNEL_NAME') private botChannelName: string,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private readonly i18n: I18nService,
    private messageFormatterService: MessageFormatterService,
  ) {
    super();
    this.triggers = ['!join'];
  }

  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    // Check if channel is in the db list, add it if necessary.
    let channelNameEntity = await this.channelRepository.findOneBy({
      channelName: chatMessage.username,
    });
    if (channelNameEntity && channelNameEntity.inChannel == true) {
      // They're already in the channel - no need to join again.
      return this.i18n.t('chat.AlreadyJoined', { lang: channel.lang });
    }
    if (!channelNameEntity) {
      channelNameEntity = new Channel();
      channelNameEntity.channelName = chatMessage.username;
    }
    channelNameEntity.inChannel = true;
    channelNameEntity.enabled = true;
    channelNameEntity.joinedOn = new Date();
    channelNameEntity.queueOpen = true;
    channelNameEntity.game = await this.gameRepository.findOneBy({
      name: 'audio_trip',
    }); // FIXME: Replace this with game detection.

    await this.channelRepository.save(channelNameEntity);

    this.logger.debug('Joining channel', {
      channelName: channelNameEntity.channelName,
    });
    // Instruct the twitch connection to join the channel.
    await chatMessage.client.joinChannel(channelNameEntity.channelName);
    this.logger.debug('Joined channel', {
      channelName: channelNameEntity.channelName,
    });

    await chatMessage.client.sendMessage(
      channelNameEntity.channelName,
      this.messageFormatterService.formatMessage(
        this.i18n.t('chat.HelloChannel', {
          lang: channelNameEntity.lang,
          defaultValue: 'Queuebot ready for action.',
        }),
      ),
    );

    return this.i18n.t('chat.JoinedChannel', {
      lang: channel.lang,
      defaultValue: 'Joined channel #{channelName}. Enjoy!',
      args: { channelName: channelNameEntity.channelName },
    });
  }

  matchesTrigger(chatMessage: ChatMessage): boolean {
    // Should only match the !join command from the bot's channel.
    return (
      chatMessage.channelName == this.botChannelName &&
      chatMessage.message == this.triggers[0]
    );
  }

  getDescription(): string {
    return "Broadcasters only.  Ask the bot to join your channel. This must be used in requestobot's channel to have it join your channel.";
  }

  shouldAlwaysTrigger(): boolean {
    return true;
  }
}
