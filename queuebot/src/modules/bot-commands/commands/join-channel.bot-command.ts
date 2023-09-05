import { BotCommandInterface } from './bot-command.interface';
import { ChatMessage } from '../../chat/services/chat-message';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { Game } from '../../data-store/entities/game.entity';
// import { I18nTranslations } from '../../../generated/i18n.generated';

@Injectable()
export class JoinChannelBotCommand implements BotCommandInterface {
  private logger: Logger = new Logger(JoinChannelBotCommand.name);

  constructor(
    @Inject('BOT_CHANNEL_NAME') private botChannelName: string,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private readonly i18n: I18nService,
  ) {}

  async execute(chatMessage: ChatMessage): Promise<void> {
    this.logger.debug('Starting join channel command');
    // Check if channel is in the db list, add it if necessary.
    let channelNameEntity = await this.channelRepository.findOneBy({
      channelName: chatMessage.username,
    });
    if (!channelNameEntity) {
      channelNameEntity = new Channel();
      channelNameEntity.channelName = chatMessage.username;
      channelNameEntity.joinedOn = new Date();
      channelNameEntity.game = await this.gameRepository.findOneBy({
        name: 'audio_trip',
      }); // FIXME: Replace this with game detection.
      await this.channelRepository.save(channelNameEntity);
      this.logger.debug('Saved channel to database', {
        channelName: channelNameEntity.channelName,
      });
    }
    this.logger.debug('Joining channel', {
      channelName: channelNameEntity.channelName,
    });
    // Instruct the twitch connection to join the channel.
    await chatMessage.client.joinChannel(channelNameEntity.channelName);
    this.logger.debug('Joined channel', {
      channelName: channelNameEntity.channelName,
    });

    await chatMessage.client.sendMessage(
      chatMessage.channelName,
      this.i18n.t('chat.JoinedChannel', {
        lang: channelNameEntity.lang,
        defaultValue: 'Joined channel #{channelName}. Enjoy!',
        args: { channelName: channelNameEntity.channelName },
      }),
    );

    await chatMessage.client.sendMessage(
      channelNameEntity.channelName,
      this.i18n.t('chat.HelloChannel', {
        lang: channelNameEntity.lang,
        defaultValue: 'Queuebot ready for action.',
      }),
    );

    return Promise.resolve();
  }

  matchesTrigger(chatMessage: ChatMessage): boolean {
    // Should only match the !join command from the bot's channel.
    return (
      chatMessage.channelName == this.botChannelName &&
      chatMessage.message == '!join'
    );
  }
}
