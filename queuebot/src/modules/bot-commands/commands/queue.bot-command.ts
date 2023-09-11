import { BotCommandInterface } from './bot-command.interface';
import { ChatMessage } from '../../chat/services/chat-message';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { MessageFormatterService } from '../services/message-formatter.service';

export class QueueBotCommand implements BotCommandInterface {
  constructor(
    private songRequestService: SongRequestService,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    private i18n: I18nService,
    private messageFormatterService: MessageFormatterService,
  ) {}
  async execute(chatMessage: ChatMessage): Promise<void> {
    const channel = await this.channelRepository.findOneBy({
      channelName: chatMessage.channelName,
    });
    const songRequests = await this.songRequestService.getAllRequests(channel);
    if (songRequests.length == 0) {
      await chatMessage.client.sendMessage(
        chatMessage.channelName,
        this.messageFormatterService.formatMessage(
          this.i18n.t('chat.QueueEmpty', { lang: channel.lang }),
        ),
      );

      return Promise.resolve();
    }

    // Spit out up to 5 songs.
    let output = '';
    let requestCountLimit = 5;
    if (songRequests.length < 5) {
      requestCountLimit = songRequests.length;
    }

    for (let i = 0; i < requestCountLimit; i++) {
      output += '#' + (i + 1) + ' ' + songRequests[i].song.title + ' ';
    }

    if (songRequests.length > requestCountLimit) {
      output += this.i18n.t('chat.AndMore', {
        lang: channel.lang,
        args: { songsRemaining: songRequests.length - requestCountLimit },
      });
    }

    await chatMessage.client.sendMessage(
      chatMessage.channelName,
      this.messageFormatterService.formatMessage(output),
    );
  }

  matchesTrigger(chatMessage: ChatMessage): boolean {
    return chatMessage.message.toLowerCase().startsWith('!queue');
  }
}
