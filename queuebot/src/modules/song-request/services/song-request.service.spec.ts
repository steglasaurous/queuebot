import { Test, TestingModule } from '@nestjs/testing';
import { SongRequestService } from './song-request.service';

describe('SongRequestService', () => {
  let service: SongRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SongRequestService],
    }).compile();

    service = module.get<SongRequestService>(SongRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
