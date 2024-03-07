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
import { SongRequestActiveEvent } from '../events/song-request-active.event';
import { QueueStrategyService } from './queue-strategies/queue-strategy.service';
import { SettingService } from '../../data-store/services/setting.service';
import { SettingName } from '../../data-store/models/setting-name.enum';

@Injectable()
export class SongRequestService {
  private logger: Logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(SongRequest)
    private songRequestRepository: Repository<SongRequest>,
    private songService: SongService,
    private eventEmitter: EventEmitter2,
    private queueStrategyService: QueueStrategyService,
    private settingService: SettingService,
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
      this.logger.log('savedSong', JSON.stringify(savedSong));

      // Search for an existing song request in the queue.
      // If it's present as a pending request, return the 'already in queue' error.
      // If it's present as a recently played request, return the 'was already played' error.
      // FUTURE: Make this configurable that if the streamer wants to allow repeats after playing a song, they can do so
      let songRequest = new SongRequest();
      songRequest.song = savedSong;
      songRequest.requesterName = requesterName;
      songRequest.requestTimestamp = new Date();

      const queueStrategyName = await this.settingService.getValue(
        channel,
        SettingName.QueueStrategy,
      );
      songRequest.channel = channel;
      songRequest.isActive = false;
      songRequest.isDone = false;

      // This sets the requestOrder and requestPriority fields.
      songRequest = await this.queueStrategyService.getNextOrder(
        channel,
        songRequest,
        queueStrategyName,
      );

      try {
        const savedSongRequest =
          await this.songRequestRepository.save(songRequest);
        this.eventEmitter.emit(SongRequestAddedEvent.name, {
          songRequest: savedSongRequest,
        });

        // Apply songRequest strategy to entity
        // We do this after the save so the strategy has the opportunity to reorder other items in the queue if necessary.

        resolve({ success: true });
        return;
      } catch (error) {
        let errorType = SongRequestErrorType.SERVER_ERROR;

        if (error.code == 23505) {
          // THis is a constraint error which we're treating as a dupe entry.  Return the appropriate error.
          errorType = SongRequestErrorType.ALREADY_IN_QUEUE;

          // Find out if this is a song that's already played vs exists in the queue.
          const existingSongRequest =
            await this.songRequestRepository.findOneBy({
              channel: channel,
              song: savedSong,
            });
          if (existingSongRequest) {
            if (existingSongRequest.isDone) {
              errorType = SongRequestErrorType.ALREADY_PLAYED;
            }
          }
        } else {
          this.logger.warn('Saving song request threw error', { error: error });
        }

        resolve({
          success: false,
          errorType: errorType,
        });
      }
    });
  }

  async getNextRequest(channel: Channel): Promise<SongRequest> {
    // Find currently active song, if any, and mark it played.
    const prevActiveRequest = await this.getCurrentRequest(channel);
    if (prevActiveRequest) {
      prevActiveRequest.isActive = false;
      prevActiveRequest.isDone = true;
      await this.songRequestRepository.save(prevActiveRequest);
    }

    const nextRequest = await this.songRequestRepository.findOne({
      where: { channel: channel, isDone: false },
      order: { requestOrder: 'asc' },
    });

    if (nextRequest) {
      nextRequest.isActive = true;

      await this.songRequestRepository.save(nextRequest);
    }

    this.eventEmitter.emit(SongRequestActiveEvent.name, {
      songRequest: nextRequest,
    });
    return nextRequest;
  }

  async getCurrentRequest(channel: Channel): Promise<SongRequest> {
    return await this.songRequestRepository.findOne({
      where: { channel: channel, isActive: true },
    });
  }

  async getAllRequests(channel: Channel): Promise<SongRequest[]> {
    return await this.songRequestRepository.find({
      where: { channel: channel, isDone: false },
      order: { requestOrder: 'asc' },
    });
  }

  async removeMostRecentRequest(
    channel: Channel,
    requesterName: string,
  ): Promise<SongRequest> {
    const mostRecentRequest = await this.songRequestRepository.findOne({
      where: { channel: channel, requesterName: requesterName, isDone: false },
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
    this.eventEmitter.emit(SongRequestQueueClearedEvent.constructor.name);
  }

  /**
   * Swaps the requestOrder between sourceSongRequestId and destinationSongRequestId.
   *
   * Note that this will fail if both requests do not belong to the same channel.
   */
  async swapOrder(
    sourceSongRequestId: number,
    destinationSongRequestId: number,
  ) {
    const sourceSongRequest = await this.songRequestRepository.findOneBy({
      id: sourceSongRequestId,
    });

    // Find the songRequest that's present in the position we want to replace.
    const songRequestToSwap = await this.songRequestRepository.findOneBy({
      id: destinationSongRequestId,
    });
    if (!songRequestToSwap) {
      // There's nothing in that current position, which is probably an error. Fail it out.
      return;
    }

    if (
      sourceSongRequest.channel.channelName !==
      songRequestToSwap.channel.channelName
    ) {
      this.logger.warn(
        'swapOrder(): Will not swap order for 2 requests belonging to different channels',
        {
          sourceChannel: sourceSongRequest.channel.channelName,
          destinationChannel: songRequestToSwap.channel.channelName,
        },
      );
      return;
    }

    const oldRequestOrder = sourceSongRequest.requestOrder;
    sourceSongRequest.requestOrder = songRequestToSwap.requestOrder;
    songRequestToSwap.requestOrder = oldRequestOrder;

    await this.songRequestRepository.save(sourceSongRequest);
    await this.songRequestRepository.save(songRequestToSwap);
  }

  // FIXME: Add a cron that clears out requests that have been played that are older than 12h
}
