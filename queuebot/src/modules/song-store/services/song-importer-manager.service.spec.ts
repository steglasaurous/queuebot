import { Test, TestingModule } from '@nestjs/testing';
import { SongImporterManagerService } from './song-importer-manager.service';

describe('SongImporterManagerService', () => {
  let service: SongImporterManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SongImporterManagerService],
    }).compile();

    service = module.get<SongImporterManagerService>(
      SongImporterManagerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
