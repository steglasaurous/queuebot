import { Test, TestingModule } from '@nestjs/testing';
import { SongService } from './song.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Song } from '../../data-store/entities/song.entity';
import { SONG_SEARCH_STRATEGIES } from '../injection-tokens';
import { getGenericNestMock } from '../../../../test/helpers';

describe('SongServiceService', () => {
  let service: SongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongService,
        {
          provide: getRepositoryToken(Song),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: SONG_SEARCH_STRATEGIES,
          useValue: [],
        },
      ],
    })
      .useMocker((token) => {
        return getGenericNestMock(token);
      })
      .compile();

    service = module.get<SongService>(SongService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
