import { Test, TestingModule } from '@nestjs/testing';
import { SongImporterManagerService } from './song-importer-manager.service';
import { SONG_IMPORTERS } from '../injection-tokens';

describe('SongImporterManagerService', () => {
  let service: SongImporterManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongImporterManagerService,
        {
          provide: SONG_IMPORTERS,
          useValue: [],
        },
      ],
    }).compile();

    service = module.get<SongImporterManagerService>(
      SongImporterManagerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
