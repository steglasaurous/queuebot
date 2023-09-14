import { BotCommandInterface } from './bot-command.interface';
import { ChatMessage } from '../../chat/services/chat-message';
import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { MessageFormatterService } from '../services/message-formatter.service';

@Injectable()
export class OpenBotCommand implements BotCommandInterface {
  constructor(
    private i18n: I18nService,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    private messageFormatterService: MessageFormatterService,
  ) {}
  async execute(chatMessage: ChatMessage): Promise<void> {
    // Only broadcasters and mods should be allowed to do this.
    if (!chatMessage.userIsBroadcaster && !chatMessage.userIsMod) {
      return;
    }

    // Mark the channel that we're not to join it again (until asked to do so).
    const channel = await this.channelRepository.findOneBy({
      channelName: chatMessage.channelName,
    });
    if (!channel.enabled) {
      return;
    }

    if (channel.queueOpen == true) {
      await chatMessage.client.sendMessage(
        chatMessage.channelName,
        this.messageFormatterService.formatMessage(
          this.i18n.t('chat.QueueAlreadyOpen'),
        ),
      );
      return;
    }

    channel.queueOpen = true;
    await this.channelRepository.save(channel);

    await chatMessage.client.sendMessage(
      chatMessage.channelName,
      this.messageFormatterService.formatMessage(this.i18n.t('chat.QueueOpen')),
    );

    // Done.
    return;
  }

  matchesTrigger(chatMessage: ChatMessage): boolean {
    return chatMessage.message.toLowerCase().startsWith('!open');
  }
}
