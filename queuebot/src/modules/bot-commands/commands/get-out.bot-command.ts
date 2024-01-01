import { ChatMessage } from '../../chat/services/chat-message';
import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { MessageFormatterService } from '../services/message-formatter.service';
import { BaseBotCommand } from './base.bot-command';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Metrics } from '../models/metrics.enum';
import { Counter, Gauge } from 'prom-client';

@Injectable()
export class GetOutBotCommand extends BaseBotCommand {
  constructor(
    private i18n: I18nService,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    private messageFormatterService: MessageFormatterService,
    @InjectMetric(Metrics.ChannelLeftCounterTotal)
    private channelLeftCounterTotal: Counter,
    @InjectMetric(Metrics.ChannelsJoinedTotal)
    private channelsJoinedTotal: Gauge,
    @InjectMetric(Metrics.ChannelsBotEnabledTotal)
    private channelsBotEnabledTotal: Gauge,
  ) {
    super();
    this.triggers = ['!getout'];
  }
  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    // Only broadcasters and mods should be allowed to do this.
    if (!chatMessage.userIsBroadcaster && !chatMessage.userIsMod) {
      return;
    }

    // Signal that we're gonna GTFO
    await chatMessage.client.sendMessage(
      chatMessage.channelName,
      this.messageFormatterService.formatMessage(
        this.i18n.t('chat.ImOut', { lang: channel.lang }),
      ),
    );

    // Leave the channel
    await chatMessage.client.leaveChannel(chatMessage.channelName);

    // Mark the channel that we're not to join it again (until asked to do so).
    channel.inChannel = false;
    channel.leftOn = new Date();
    await this.channelRepository.save(channel);

    this.channelLeftCounterTotal.inc();
    this.channelsJoinedTotal.dec();
    this.channelsBotEnabledTotal.dec();

    // Done.
    return;
  }

  getDescription(): string {
    return 'Broadcaster and mods only. Have requestobot leave your channel. Once left, commands will not work until you invite the bot into your channel again.';
  }

  shouldAlwaysTrigger(): boolean {
    return true;
  }
}
