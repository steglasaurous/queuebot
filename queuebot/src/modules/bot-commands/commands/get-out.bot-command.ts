import { BotCommandInterface } from './bot-command.interface';
import { ChatMessage } from '../../chat/services/chat-message';
import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetOutBotCommand implements BotCommandInterface {
  constructor(
    private i18n: I18nService,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
  ) {}
  async execute(chatMessage: ChatMessage): Promise<void> {
    // Only broadcasters and mods should be allowed to do this.
    if (!chatMessage.userIsBroadcaster && !chatMessage.userIsMod) {
      return;
    }

    // Signal that we're gonna GTFO
    await chatMessage.client.sendMessage(
      chatMessage.channelName,
      this.i18n.t('chat.ImOut'),
    );

    // Leave the channel
    await chatMessage.client.leaveChannel(chatMessage.channelName);

    // Mark the channel that we're not to join it again (until asked to do so).
    const channel = await this.channelRepository.findOneBy({
      channelName: chatMessage.channelName,
    });
    channel.inChannel = false;
    channel.leftOn = new Date();
    await this.channelRepository.save(channel);

    // Done.
    return;
  }

  matchesTrigger(chatMessage: ChatMessage): boolean {
    return chatMessage.message.toLowerCase().startsWith('!getout');
  }
}
