import { Test, TestingModule } from '@nestjs/testing';
import { ModIoApiService } from './mod-io-api.service';

describe('ModIoApiService', () => {
  let service: ModIoApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModIoApiService],
    }).compile();

    service = module.get<ModIoApiService>(ModIoApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
