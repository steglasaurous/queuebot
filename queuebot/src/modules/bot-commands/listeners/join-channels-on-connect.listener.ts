import { ChatClientConnectedEvent } from '../../chat/events/chat-client-connected.event';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Metrics } from '../models/metrics.enum';
import { Counter, Gauge } from 'prom-client';

export class JoinChannelsOnConnectListener {
  private logger: Logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectMetric(Metrics.ChannelsJoinedTotal)
    private channelsJoinedTotal: Gauge,
    @InjectMetric(Metrics.ChannelJoinedCounterTotal)
    private channelJoinedCounterTotal: Counter,
  ) {}
  @OnEvent(ChatClientConnectedEvent.name)
  async handle(chatConnectedEvent: ChatClientConnectedEvent) {
    const channels = await this.channelRepository.find({
      where: { inChannel: true },
    });

    this.channelsJoinedTotal.set(channels.length);

    for (const channel of channels) {
      await chatConnectedEvent.client.joinChannel(channel.channelName);
      this.channelJoinedCounterTotal.inc({
        labels: { join_source: 'connect' },
      });
      this.logger.log(`Joined channel ${channel.channelName}`);
    }
  }
}
