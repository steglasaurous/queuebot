import { ChatClientConnectedEvent } from '../../chat/events/chat-client-connected.event';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

export class JoinChannelsOnConnectListener {
  private logger: Logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
  ) {}
  @OnEvent(ChatClientConnectedEvent.name)
  async handle(chatConnectedEvent: ChatClientConnectedEvent) {
    const channels = await this.channelRepository.find({
      where: { inChannel: true },
    });
    channels.forEach(async (channel) => {
      await chatConnectedEvent.client.joinChannel(channel.channelName);
      this.logger.log(`Joined channel ${channel.channelName}`);
    });
  }
}
