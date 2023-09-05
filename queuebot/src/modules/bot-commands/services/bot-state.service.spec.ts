import { Test, TestingModule } from '@nestjs/testing';
import { BotStateService } from './bot-state.service';

describe('BotStateService', () => {
  let service: BotStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotStateService],
    }).compile();

    service = module.get<BotStateService>(BotStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
