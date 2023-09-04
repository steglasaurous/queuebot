import { Test, TestingModule } from '@nestjs/testing';
import { AudioTripSongImporterService } from './audio-trip-song-importer.service';

describe('AudioTripSongImporterService', () => {
  let service: AudioTripSongImporterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AudioTripSongImporterService],
    }).compile();

    service = module.get<AudioTripSongImporterService>(
      AudioTripSongImporterService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
