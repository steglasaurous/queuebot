import { BotCommandInterface } from './bot-command.interface';
import { ChatMessage } from '../../chat/services/chat-message';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { MessageFormatterService } from '../services/message-formatter.service';

export class OopsBotCommand implements BotCommandInterface {
  constructor(
    private songRequestService: SongRequestService,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    private i18n: I18nService,
    private messageFormatterService: MessageFormatterService,
  ) {}
  async execute(chatMessage: ChatMessage): Promise<void> {
    // Find the most recent request this user made on this channel, and remove it.
    const channel = await this.channelRepository.findOneBy({
      channelName: chatMessage.channelName,
    });
    const songRequest = await this.songRequestService.removeMostRecentRequest(
      channel,
      chatMessage.username,
    );
    if (songRequest) {
      await chatMessage.client.sendMessage(
        chatMessage.channelName,
        this.messageFormatterService.formatMessage(
          this.i18n.t('chat.RequestRemoved', {
            args: { title: songRequest.song.title },
          }),
        ),
      );
      return;
    }

    await chatMessage.client.sendMessage(
      chatMessage.channelName,
      this.messageFormatterService.formatMessage(
        this.i18n.t('chat.NoUserSongRequestToRemove'),
      ),
    );
  }

  matchesTrigger(chatMessage: ChatMessage): boolean {
    return chatMessage.message.toLowerCase().startsWith('!oops');
  }
}
