import { Injectable, Logger } from '@nestjs/common';
import { SongRequest } from '../../data-store/entities/song-request.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from '../../data-store/entities/song.entity';
import { Channel } from '../../data-store/entities/channel.entity';
import { SongRequestResponse } from '../models/song-request-response.interface';
import { SongRequestErrorType } from '../models/song-request-error-type.enum';
import { SongService } from '../../song-store/services/song.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SongRequestAddedEvent } from '../events/song-request-added.event';
import { SongRequestRemovedEvent } from '../events/song-request-removed.event';
import { SongRequestQueueClearedEvent } from '../events/song-request-queue-cleared.event';

@Injectable()
export class SongRequestService {
  private logger: Logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(SongRequest)
    private songRequestRepository: Repository<SongRequest>,
    private songService: SongService,
    private eventEmitter: EventEmitter2,
  ) {}

  async addRequest(
    song: Song,
    channel: Channel,
    requesterName: string,
  ): Promise<SongRequestResponse> {
    return new Promise<SongRequestResponse>(async (resolve) => {
      let savedSong: Song;
      if (!song.id) {
        // If the song hasn't been persisted to database, do that first.
        savedSong = await this.songService.saveSong(song);
      } else {
        savedSong = song;
      }

      const songRequest = new SongRequest();
      songRequest.song = savedSong;
      songRequest.requesterName = requesterName;
      songRequest.requestTimestamp = Date.now();
      songRequest.requestOrder =
        (await this.songRequestRepository.maximum('requestOrder', {
          channel: channel,
        })) + 1; // Not sure what the performance implications are on this.  Will have to keep an eye on it for now.
      songRequest.channel = channel;

      try {
        const savedSongRequest =
          await this.songRequestRepository.save(songRequest);
        this.eventEmitter.emit(SongRequestAddedEvent.name, {
          songRequest: savedSongRequest,
        });
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
    this.eventEmitter.emit(SongRequestRemovedEvent.name, {
      songRequest: nextRequest,
    });
    return nextRequest;
  }

  async getAllRequests(channel: Channel): Promise<SongRequest[]> {
    return await this.songRequestRepository.find({
      where: { channel: channel },
      order: { requestOrder: 'asc' },
    });
  }

  async removeMostRecentRequest(
    channel: Channel,
    requesterName: string,
  ): Promise<SongRequest> {
    const mostRecentRequest = await this.songRequestRepository.findOne({
      where: { channel: channel, requesterName: requesterName },
      order: { requestOrder: 'desc' },
    });
    if (mostRecentRequest) {
      await this.songRequestRepository.remove(mostRecentRequest);
      this.eventEmitter.emit(SongRequestRemovedEvent.name, {
        songRequest: mostRecentRequest,
      });
      return mostRecentRequest;
    }

    return;
  }

  async clearAllRequests(channel: Channel) {
    await this.songRequestRepository.delete({ channel: channel });
    this.eventEmitter.emit(SongRequestQueueClearedEvent.name);
  }
}
