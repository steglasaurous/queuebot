import { Test, TestingModule } from '@nestjs/testing';
import { SongRequestsController } from './song-requests.controller';
import { getGenericNestMock } from '../../../../test/helpers';

describe('SongRequestsController', () => {
  let controller: SongRequestsController;
  let channelRepositoryMock = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongRequestsController],
    })
      .useMocker((token) => {
        switch (token) {
          case 'ChannelRepository':
            return channelRepositoryMock;
          default:
            return getGenericNestMock(token);
        }
      })
      .compile();

    controller = module.get<SongRequestsController>(SongRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
