import { Test, TestingModule } from '@nestjs/testing';
import { SongRequestService } from './song-request.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SongRequest } from '../../data-store/entities/song-request.entity';
import { getGenericNestMock } from '../../../../test/helpers';

describe('SongRequestService', () => {
  let service: SongRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongRequestService,
        {
          provide: getRepositoryToken(SongRequest),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    })
      .useMocker((token) => {
        return getGenericNestMock(token);
      })
      .compile();

    service = module.get<SongRequestService>(SongRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
