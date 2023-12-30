import { Test, TestingModule } from '@nestjs/testing';
import { ModIoApiService } from './mod-io-api.service';
import { MOD_IO_API_KEY, MOD_IO_BASE_URL } from '../injection-tokens';
import { getGenericNestMock } from '../../../../test/helpers';

describe('ModIoApiService', () => {
  let service: ModIoApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModIoApiService],
    })
      .useMocker((token) => {
        switch (token) {
          case MOD_IO_BASE_URL:
          case MOD_IO_API_KEY:
            return token;
          default:
            return getGenericNestMock(token);
        }
      })
      .compile();

    service = module.get<ModIoApiService>(ModIoApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
