import { Test, TestingModule } from '@nestjs/testing';
import { SongRequestsController } from './song-requests.controller';

describe('SongRequestsController', () => {
  let controller: SongRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongRequestsController],
    }).compile();

    controller = module.get<SongRequestsController>(SongRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
