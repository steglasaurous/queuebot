import { Test, TestingModule } from '@nestjs/testing';
import { getGenericNestMock } from '../../../../test/helpers';
import { ChatMessage } from '../../chat/services/chat-message';
import { Channel } from '../../data-store/entities/channel.entity';
import { I18nService } from 'nestjs-i18n';
import { OpenBotCommand } from './open.bot-command';
import { SetGameBotCommand } from './set-game.bot-command';
import { Game } from '../../data-store/entities/game.entity';

describe('Set game bot command', () => {
  const channelRepositoryMock = {
    save: jest.fn(),
    findOneBy: jest.fn(),
  };
  const gameRepositoryMock = {
    findBy: jest.fn(),
  };

  let service: SetGameBotCommand;
  let i18n;

  let channel;
  let chatMessage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SetGameBotCommand],
    })
      .useMocker((token) => {
        switch (token) {
          case 'ChannelRepository':
            return channelRepositoryMock;
          case 'GameRepository':
            return gameRepositoryMock;
          case I18nService:
            return {
              t: jest.fn(),
            };
          default:
            return getGenericNestMock(token);
        }
      })
      .compile();

    service = module.get(SetGameBotCommand);
    i18n = module.get(I18nService);
    i18n.t.mockImplementation((key: string) => {
      return key;
    });

    channel = new Channel();
    channel.lang = 'en';
    channel.queueOpen = false;

    chatMessage = {
      userIsBroadcaster: true,
      userIsMod: false,
      username: 'steglasaurous',
      message: '!setgame audio trip',
    } as unknown as ChatMessage;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should set the game to the one specified', async () => {
    const game = new Game();
    game.name = 'somegame';
    game.displayName = 'Some Game';

    gameRepositoryMock.findBy.mockReturnValue([game]);

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.GameChanged');
    expect(i18n.t).toHaveBeenCalledWith('chat.GameChanged', {
      lang: 'en',
      args: { gameName: 'Some Game' },
    });
  });

  it('should show the currently set game', async () => {});

  it('should indicate the game name matched too many games', async () => {});

  it('should indicate the game searched is unsupported or not known', async () => {});

  it('should not respond if the user is not a broadcaster or moderator', async () => {
    chatMessage.userIsBroadcaster = false;
    chatMessage.userIsMod = false;

    const response = await service.execute(channel, chatMessage);
    expect(response).toBeUndefined();
    expect(channelRepositoryMock.save).not.toHaveBeenCalled();
  });
});
