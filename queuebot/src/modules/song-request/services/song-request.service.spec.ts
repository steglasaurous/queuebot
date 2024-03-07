import { Test, TestingModule } from '@nestjs/testing';
import { SongRequestService } from './song-request.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SongRequest } from '../../data-store/entities/song-request.entity';
import {
  getGenericNestMock,
  getMockChannel,
  getSampleSong,
} from '../../../../test/helpers';
import { SettingService } from '../../data-store/services/setting.service';
import { QueueStrategyService } from './queue-strategies/queue-strategy.service';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SongRequestAddedEvent } from '../events/song-request-added.event';
import { SongService } from '../../song-store/services/song.service';
import { SongRequestErrorType } from '../models/song-request-error-type.enum';

describe('SongRequestService', () => {
  let service: SongRequestService;
  let mockSettingService;
  let mockQueueStrategyService;
  let mockSongRequestRepository;
  let mockEventEmitter;
  let mockSongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SongRequestService],
    })
      .useMocker((token) => {
        switch (token) {
          case getRepositoryToken(SongRequest):
            return {
              findOneBy: jest.fn(),
              save: jest.fn(),
            };
        }
        return getGenericNestMock(token);
      })
      .compile();

    service = module.get<SongRequestService>(SongRequestService);
    mockSettingService = module.get<SettingService>(SettingService);
    mockQueueStrategyService =
      module.get<QueueStrategyService>(QueueStrategyService);
    mockSongRequestRepository = module.get<Repository<SongRequest>>(
      getRepositoryToken(SongRequest),
    );
    mockEventEmitter = module.get<EventEmitter2>(EventEmitter2);
    mockSongService = module.get<SongService>(SongService);

    mockQueueStrategyService.getNextOrder.mockImplementation(
      (channel, songRequest) => {
        songRequest.requestOrder = 1;
        songRequest.requestPriority = 0;
        return songRequest;
      },
    );
  });

  const expectSuccessfulSongRequest = (expectedSongRequestObject: any) => {
    expect(mockSongRequestRepository.save.mock.calls[0][0].song).toEqual(
      expectedSongRequestObject.song,
    );
    expect(
      mockSongRequestRepository.save.mock.calls[0][0].requesterName,
    ).toEqual(expectedSongRequestObject.requesterName);
    expect(
      mockSongRequestRepository.save.mock.calls[0][0].requestTimestamp.valueOf(),
    ).toBeGreaterThanOrEqual(
      expectedSongRequestObject.requestTimestamp.valueOf(),
    );
    expect(
      mockSongRequestRepository.save.mock.calls[0][0].requestOrder,
    ).toEqual(expectedSongRequestObject.requestOrder);
    expect(mockSongRequestRepository.save.mock.calls[0][0].channel).toEqual(
      expectedSongRequestObject.channel,
    );
    expect(mockSongRequestRepository.save.mock.calls[0][0].isActive).toEqual(
      expectedSongRequestObject.isActive,
    );
    expect(mockSongRequestRepository.save.mock.calls[0][0].isDone).toEqual(
      expectedSongRequestObject.isDone,
    );

    expect(mockEventEmitter.emit.mock.calls[0][0]).toEqual(
      SongRequestAddedEvent.name,
    );
    expect(mockEventEmitter.emit.mock.calls[0][1].songRequest.song).toEqual(
      expectedSongRequestObject.song,
    );
    expect(
      mockEventEmitter.emit.mock.calls[0][1].songRequest.requesterName,
    ).toEqual(expectedSongRequestObject.requesterName);
    expect(
      mockEventEmitter.emit.mock.calls[0][1].songRequest.requestTimestamp.valueOf(),
    ).toBeGreaterThanOrEqual(
      expectedSongRequestObject.requestTimestamp.valueOf(),
    );

    expect(
      mockEventEmitter.emit.mock.calls[0][1].songRequest.requestOrder,
    ).toEqual(expectedSongRequestObject.requestOrder);
    expect(mockEventEmitter.emit.mock.calls[0][1].songRequest.channel).toEqual(
      expectedSongRequestObject.channel,
    );
    expect(mockEventEmitter.emit.mock.calls[0][1].songRequest.isActive).toEqual(
      expectedSongRequestObject.isActive,
    );
    expect(mockEventEmitter.emit.mock.calls[0][1].songRequest.isDone).toEqual(
      expectedSongRequestObject.isDone,
    );
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a song request to the queue', async () => {
    const song = getSampleSong(1);
    const channel = getMockChannel();
    const requesterName = 'steg';
    mockSettingService.getValue.mockReturnValue('fifo');

    const expectedSongRequestObject = new SongRequest();
    expectedSongRequestObject.song = song;
    expectedSongRequestObject.requesterName = 'steg';
    expectedSongRequestObject.requestTimestamp = new Date();
    expectedSongRequestObject.requestOrder = 1;
    expectedSongRequestObject.channel = channel;
    expectedSongRequestObject.isActive = false;
    expectedSongRequestObject.isDone = false;

    mockSongRequestRepository.save.mockImplementation((songRequest) => {
      return songRequest;
    });

    const result = await service.addRequest(song, channel, requesterName);
    expect(result.success).toBeTruthy();
    expectSuccessfulSongRequest(expectedSongRequestObject);
  });

  it('should save the song to the song database if it does not exist', async () => {
    const song = getSampleSong(1);
    const channel = getMockChannel();
    const requesterName = 'steg';

    song.id = undefined;

    mockSongService.saveSong.mockImplementation((song) => {
      song.id = 1;
      return Promise.resolve(song);
    });

    mockSettingService.getValue.mockReturnValue(Promise.resolve('fifo'));

    const expectedSongRequestObject = {
      song: song,
      requesterName: 'steg',
      requestTimestamp: new Date(),
      requestOrder: 1,
      channel: channel,
      isActive: false,
      isDone: false,
    };

    mockSongRequestRepository.save.mockImplementation((songRequest) => {
      return songRequest;
    });

    const result = await service.addRequest(song, channel, requesterName);
    expect(result.success).toBeTruthy();
    expectSuccessfulSongRequest(expectedSongRequestObject);
  });

  it('should return an already in queue error if the song is already present in the queue', async () => {
    const song = getSampleSong(1);
    const channel = getMockChannel();
    const requesterName = 'steg';
    mockSettingService.getValue.mockReturnValue('fifo');

    const existingSongRequestObject = {
      id: 1,
      song: song,
      requesterName: 'steg',
      requestTimestamp: new Date(),
      requestOrder: 1,
      channel: channel,
      isActive: false,
      isDone: false,
    };

    mockSongRequestRepository.save.mockImplementation(() => {
      return Promise.reject({ code: 23505 });
    });

    mockSongRequestRepository.findOneBy.mockReturnValue(
      existingSongRequestObject,
    );

    const result = await service.addRequest(song, channel, requesterName);
    expect(result.success).toBeFalsy();
    expect(result.errorType).toEqual(SongRequestErrorType.ALREADY_IN_QUEUE);
    expect(mockEventEmitter.emit).not.toHaveBeenCalled();
  });

  it('should return an already played error if the song has already been played', async () => {
    const song = getSampleSong(1);
    const channel = getMockChannel();
    const requesterName = 'steg';
    mockSettingService.getValue.mockReturnValue('fifo');
    const existingSongRequestObject = {
      id: 1,
      song: song,
      requesterName: 'steg',
      requestTimestamp: new Date(),
      requestOrder: 1,
      channel: channel,
      isActive: false,
      isDone: true,
    };

    mockSongRequestRepository.save.mockImplementation(() => {
      return Promise.reject({ code: 23505 });
    });

    mockSongRequestRepository.findOneBy.mockReturnValue(
      existingSongRequestObject,
    );

    const result = await service.addRequest(song, channel, requesterName);
    expect(result.success).toBeFalsy();
    expect(result.errorType).toEqual(SongRequestErrorType.ALREADY_PLAYED);
    expect(mockEventEmitter.emit).not.toHaveBeenCalled();
  });

  it('should return a general error if something went wrong with saving or emitting the event', async () => {
    const song = getSampleSong(1);
    const channel = getMockChannel();
    const requesterName = 'steg';

    mockSettingService.getValue.mockReturnValue(Promise.resolve('fifo'));

    mockSongRequestRepository.save.mockImplementation(() => {
      return Promise.reject({ code: 99999 });
    });

    const result = await service.addRequest(song, channel, requesterName);
    expect(result.success).toBeFalsy();
    expect(result.errorType).toEqual(SongRequestErrorType.SERVER_ERROR);
    expect(mockEventEmitter.emit).not.toHaveBeenCalled();
  });

  // FIXME: Write tests for remaining methods:
  // getNextRequest()
  // getCurrentRequest()
  // getAllRequests()
  // removeMOstRecentRequest()
  // clearAllRequests()
  // swapOrder()
});
