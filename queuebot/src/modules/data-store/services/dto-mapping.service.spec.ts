import { Test, TestingModule } from '@nestjs/testing';
import { DtoMappingService } from './dto-mapping.service';

describe('DtoMappingService', () => {
  let service: DtoMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DtoMappingService],
    }).compile();

    service = module.get<DtoMappingService>(DtoMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
