import { BotCommandInterface } from './bot-command.interface';
import { ChatMessage } from '../../chat/services/chat-message';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { Repository } from 'typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { MessageFormatterService } from '../services/message-formatter.service';

export class NextSongBotCommand implements BotCommandInterface {
  constructor(
    private songRequestService: SongRequestService,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    private i18n: I18nService,
    private messageFormatterService: MessageFormatterService,
  ) {}
  async execute(chatMessage: ChatMessage): Promise<void> {
    // Only broadcaster and mods can trigger this command.
    if (!chatMessage.userIsBroadcaster && !chatMessage.userIsMod) {
      return;
    }

    const channel = await this.channelRepository.findOneBy({
      channelName: chatMessage.channelName,
    });
    const nextRequest = await this.songRequestService.getNextRequest(channel);
    if (nextRequest) {
      await chatMessage.client.sendMessage(
        chatMessage.channelName,
        this.messageFormatterService.formatMessage(
          this.i18n.t('chat.NextRequest', {
            lang: channel.lang,
            args: {
              title: nextRequest.song.title,
              artist: nextRequest.song.artist,
              mapper: nextRequest.song.mapper,
              requesterName: nextRequest.requesterName,
            },
          }),
        ),
      );

      return Promise.resolve();
    }

    await chatMessage.client.sendMessage(
      chatMessage.channelName,
      this.messageFormatterService.formatMessage(
        this.i18n.t('chat.QueueEmpty', {
          lang: channel.lang,
        }),
      ),
    );

    return Promise.resolve();
  }

  matchesTrigger(chatMessage: ChatMessage): boolean {
    return chatMessage.message.toLowerCase().startsWith('!nextsong');
  }
}
