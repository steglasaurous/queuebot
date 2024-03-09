import { Test, TestingModule } from '@nestjs/testing';
import { SongRequestsController } from './song-requests.controller';
import { getGenericNestMock } from '../../../../test/helpers';

describe('SongRequestsController', () => {
  let controller: SongRequestsController;
  const channelRepositoryMock = {
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
          case 'JWT_COOKIE_NAME':
            return 'jwt_cookie';
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

  // FIXME: Write tests to cover the controller.
});
