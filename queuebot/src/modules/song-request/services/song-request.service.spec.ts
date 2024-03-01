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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a song request to the queue', async () => {
    const song = getSampleSong(1);
    const channel = getMockChannel();
    const requesterName = 'steg';
    mockSettingService.getValue.mockReturnValue('fifo');
    mockQueueStrategyService.getNextOrder.mockReturnValue(1);
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
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      SongRequestAddedEvent.name,
      { songRequest: expectedSongRequestObject },
    );
    expect(mockSongRequestRepository.save).toHaveBeenCalledWith(
      expectedSongRequestObject,
    );
  });

  it('should save the song to the song database if it does not exist', async () => {
    const song = getSampleSong(1);
    const channel = getMockChannel();
    const requesterName = 'steg';

    song.id = undefined;

    mockSongService.saveSong.mockImplementation((song) => {
      song.id = 1;
      return song;
    });

    mockSettingService.getValue.mockReturnValue(Promise.resolve('fifo'));
    mockQueueStrategyService.getNextOrder.mockReturnValue(1);
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
    expect(mockSongService.saveSong).toHaveBeenCalledWith(song);
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      SongRequestAddedEvent.name,
      { songRequest: expectedSongRequestObject },
    );
    expect(mockSongRequestRepository.save).toHaveBeenCalledWith(
      expectedSongRequestObject,
    );
  });
  // FIXME: Finish remaining unit tests
});
