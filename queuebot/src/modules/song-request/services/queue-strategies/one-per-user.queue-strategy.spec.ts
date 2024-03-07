import { Test, TestingModule } from '@nestjs/testing';
import {
  getGenericNestMock,
  getMockChannel,
  getSampleSongRequests,
} from '../../../../../test/helpers';
import { OnePerUserQueueStrategy } from './one-per-user.queue-strategy';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SongRequest } from '../../../data-store/entities/song-request.entity';

describe('One-Per-User QueueStrategy', () => {
  let service: OnePerUserQueueStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnePerUserQueueStrategy],
    })
      .useMocker((token) => {
        switch (token) {
          case getRepositoryToken(SongRequest):
            return {
              countBy: jest.fn(),
              maximum: jest.fn(),
              findOne: jest.fn(),
            };
        }

        return getGenericNestMock(token);
      })
      .compile();

    service = module.get<OnePerUserQueueStrategy>(OnePerUserQueueStrategy);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set order to 1 and priority to 0 if the queue is empty', async () => {
    const channel = getMockChannel();
    const songRequest = getSampleSongRequests(1)[0];

    // FIXME: Continue here: Implement these tests, make sure the
  });

  it('should add the user to the end of the queue if they already have a request', async () => {});

  it('should add the request to the end of the next priority group if they already have a song in the queue', async () => {});

  it('should add the request to the end of the next priority group when there are multiple groups already present', async () => {});
});
