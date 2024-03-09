import { Channel } from 'src/modules/data-store/entities/channel.entity';
import { SongRequest } from 'src/modules/data-store/entities/song-request.entity';
import { QueueStrategy } from './queue-strategy.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FifoQueueStrategy implements QueueStrategy {
  constructor(
    @InjectRepository(SongRequest)
    private songRequestRepository: Repository<SongRequest>,
  ) {}
  async setNextOrder(
    channel: Channel,
    songRequest: SongRequest,
  ): Promise<SongRequest> {
    songRequest.requestOrder =
      (await this.songRequestRepository.maximum('requestOrder', {
        channel: channel,
      })) + 1;
    songRequest.requestPriority = 0;
    return songRequest;
  }

  getStrategyName(): string {
    return 'fifo';
  }
}
