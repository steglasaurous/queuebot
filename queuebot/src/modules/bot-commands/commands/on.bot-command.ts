import { BotCommandInterface } from './bot-command.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { MessageFormatterService } from '../services/message-formatter.service';
import { ChatMessage } from '../../chat/services/chat-message';

@Injectable()
export class OnBotCommand implements BotCommandInterface {
  constructor(
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    private i18n: I18nService,
    private messageFormatter: MessageFormatterService,
  ) {}

  async execute(chatMessage: ChatMessage): Promise<void> {
    // Only broadcaster and mods can use this.
    if (!chatMessage.userIsBroadcaster && !chatMessage.userIsMod) {
      return;
    }

    const channel = await this.channelRepository.findOneBy({
      channelName: chatMessage.channelName,
    });
    if (channel.enabled) {
      await chatMessage.client.sendMessage(
        chatMessage.channelName,
        this.messageFormatter.formatMessage(this.i18n.t('AlreadyOn')),
      );
      return;
    }

    channel.enabled = true;

    await this.channelRepository.save(channel);
    await chatMessage.client.sendMessage(
      chatMessage.channelName,
      this.messageFormatter.formatMessage(this.i18n.t('BotIsOn')),
    );
    return;
  }

  matchesTrigger(chatMessage: ChatMessage): boolean {
    return chatMessage.message.toLowerCase().startsWith('!requestobot on');
  }
}
