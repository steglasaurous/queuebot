import { Test, TestingModule } from '@nestjs/testing';
import { BotCommandListener } from './bot-command.listener';
import { getGenericNestMock } from '../../../../test/helpers';
import { getToken } from '@willsoto/nestjs-prometheus';
import { Metrics } from '../models/metrics.enum';

describe('Bot command listener', () => {
  let mockBotCommand = {
    matchesTrigger: jest.fn(),
    execute: jest.fn(),
  };

  let mockChannelRepository = {
    findOneBy: jest.fn(),
  };
  let mockBotCommandsExecutedTotal;
  let service: BotCommandListener;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotCommandListener],
    })
      .useMocker((token) => {
        switch (token) {
          case 'BOT_COMMANDS':
            return [mockBotCommand];
          case 'BOT_CHANNEL_NAME':
            return 'BOT_CHANNEL_NAME';
          case 'ChannelRepository':
            return mockChannelRepository;
          case getToken(Metrics.BotCommandsExecutedTotal):
            return mockBotCommandsExecutedTotal;
        }
        return getGenericNestMock(token);
      })
      .compile();

    service = module.get(BotCommandListener);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  xit('should execute the bot command matching the trigger', async () => {});
});
