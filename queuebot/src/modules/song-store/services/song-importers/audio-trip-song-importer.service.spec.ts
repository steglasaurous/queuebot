import { Test, TestingModule } from '@nestjs/testing';
import { AudioTripSongImporterService } from './audio-trip-song-importer.service';
import { getGenericNestMock } from '../../../../../test/helpers';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from '../../../data-store/entities/game.entity';

describe('AudioTripSongImporterService', () => {
  let service: AudioTripSongImporterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AudioTripSongImporterService,
        {
          provide: getRepositoryToken(Game),
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

    service = module.get<AudioTripSongImporterService>(
      AudioTripSongImporterService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
