import { BotCommandInterface } from './bot-command.interface';
import { ChatMessage } from '../../chat/services/chat-message';
import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { MessageFormatterService } from '../services/message-formatter.service';
import { SongRequestService } from '../../song-request/services/song-request.service';

@Injectable()
export class ClearBotCommand implements BotCommandInterface {
  constructor(
    private i18n: I18nService,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    private messageFormatterService: MessageFormatterService,
    private songRequestService: SongRequestService,
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

    await this.songRequestService.clearAllRequests(channel);
    await chatMessage.client.sendMessage(
      chatMessage.channelName,
      this.messageFormatterService.formatMessage(
        this.i18n.t('chat.QueueCleared'),
      ),
    );

    // Done.
    return;
  }

  matchesTrigger(chatMessage: ChatMessage): boolean {
    return chatMessage.message.toLowerCase().startsWith('!clear');
  }
}
