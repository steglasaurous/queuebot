import { Test, TestingModule } from '@nestjs/testing';
import { getGenericNestMock } from '../../../../test/helpers';
import { I18nService } from 'nestjs-i18n';
import { RemoveBotCommand } from './remove.bot-command';

describe('Remove command', () => {
  let service: RemoveBotCommand;

  let i18n;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemoveBotCommand],
    })
      .useMocker((token) => {
        return getGenericNestMock(token);
      })
      .compile();

    service = module.get(RemoveBotCommand);
    i18n = module.get(I18nService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });
});
