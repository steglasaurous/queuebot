import { Injectable, Logger } from '@nestjs/common';
import { SongRequest } from '../../data-store/entities/song-request.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from '../../data-store/entities/song.entity';
import { Channel } from '../../data-store/entities/channel.entity';
import { SongRequestResponse } from '../models/song-request-response.interface';
import { SongRequestErrorType } from '../models/song-request-error-type.enum';

@Injectable()
export class SongRequestService {
  private logger: Logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(SongRequest)
    private songRequestRepository: Repository<SongRequest>,
  ) {}

  async addRequest(
    song: Song,
    channel: Channel,
    requesterName: string,
  ): Promise<SongRequestResponse> {
    return new Promise<SongRequestResponse>(async (resolve) => {
      let songRequest = new SongRequest();
      songRequest.song = song;
      songRequest.requesterName = requesterName;
      songRequest.requestTimestamp = Date.now();
      songRequest.requestOrder =
        (await this.songRequestRepository.maximum('requestOrder', {
          channel: channel,
        })) + 1; // Not sure what the performance implications are on this.  Will have to keep an eye on it for now.
      songRequest.channel = channel;

      try {
        await this.songRequestRepository.save(songRequest);
        resolve({ success: true });
      } catch (error) {
        let errorType = SongRequestErrorType.SERVER_ERROR;

        if (error.errno == 19) {
          // THis is a constraint error which we're treating as a dupe entry.  Return the appropriate error.
          errorType = SongRequestErrorType.ALREADY_IN_QUEUE;
        }
        this.logger.log('saving song request threw error', { error: error });
        resolve({
          success: false,
          errorType: errorType,
        });
      }
    });
  }

  async getNextRequest(channel: Channel): Promise<SongRequest> {
    const nextRequest = await this.songRequestRepository.findOne({
      where: { channel: channel },
      order: { requestOrder: 'asc' },
    });
    if (!nextRequest) {
      return undefined;
    }

    await this.songRequestRepository.remove(nextRequest);

    return nextRequest;
  }
}