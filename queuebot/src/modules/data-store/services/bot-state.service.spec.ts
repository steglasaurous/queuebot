import { Test, TestingModule } from '@nestjs/testing';
import { BotStateService } from './bot-state.service';
import { getGenericNestMock } from '../../../../test/helpers';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Channel } from '../entities/channel.entity';
import { UserBotState } from '../entities/user-bot-state.entity';

describe('BotStateService', () => {
  let service: BotStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotStateService,
        {
          provide: getRepositoryToken(UserBotState),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Channel),
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

    service = module.get<BotStateService>(BotStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
