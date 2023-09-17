import { Test, TestingModule } from '@nestjs/testing';
import { SongRequestBotCommand } from './song-request.bot-command';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { getGenericNestMock } from '../../../../test/helpers';
import { BotStateService } from '../services/bot-state.service';
import { I18nService } from 'nestjs-i18n';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { MessageFormatterService } from '../services/message-formatter.service';
import { AbstractChatClient } from '../../chat/services/clients/abstract-chat.client';
import { Game } from '../../data-store/entities/game.entity';
import { ChatMessage } from '../../chat/services/chat-message';
import { SongService } from '../../song-store/services/song.service';

describe('SongRequestBotCommand', () => {
  let botCommand: SongRequestBotCommand;
  let botStateService;
  let i18n;
  let songRequestService;
  let messageFormatterService;
  let channelRepository;
  let songService;

  const getChatMessageObject = (): ChatMessage => {
    return {
      channelName: 'testchannel',
      client: {
        sendMessage: jest.fn(),
      } as unknown as AbstractChatClient,
      message: '',
      id: '1',
      date: new Date(),
      color: '',
      emotes: new Map<string, string[]>(),
      userIsBroadcaster: false,
      userIsMod: false,
      userIsSubscriber: false,
      userIsVip: false,
      username: 'testuser',
    } as ChatMessage;
  };

  const getChannelObject = (): Channel => {
    const game = new Game();
    game.id = 1;
    game.name = 'spin';

    const channel = new Channel();
    channel.enabled = true;
    channel.queueOpen = true;
    channel.channelName = 'testchannel';
    channel.game = game;
    channel.lang = 'en';

    return channel;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongRequestBotCommand,
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

    botCommand = module.get<SongRequestBotCommand>(SongRequestBotCommand);
    botStateService = module.get(BotStateService);
    i18n = module.get(I18nService);
    songRequestService = module.get(SongRequestService);
    messageFormatterService = module.get(MessageFormatterService);
    channelRepository = module.get(getRepositoryToken(Channel));
    songService = module.get(SongService);
  });

  it('should be defined', () => {
    expect(botCommand).toBeDefined();
  });

  // FIXME: RIght now using the built-in nest logger, we can't spy on it or mock it because it's private.
  //        I'm thinking replace with winston so we can spy on it AND log to other things like syslog.
  xit('should not do anything if the channelName cannot be found in the database', async () => {
    channelRepository.findOneBy.mockImplementation(() => {
      return undefined;
    });

    await botCommand.execute(getChatMessageObject());
  });

  xit('should not respond if the bot is disabled in the channel', async () => {});

  it('should display a help message relevant to the current game if no search terms are present', async () => {
    const channel = getChannelObject();

    channelRepository.findOneBy.mockImplementation(() => {
      return channel;
    });

    const chatMessage = getChatMessageObject();
    chatMessage.message = '!req';

    i18n.t.mockImplementation(() => {
      return 'SPIN HELP';
    });

    messageFormatterService.formatMessage.mockImplementation((message) => {
      return '! ' + message;
    });

    await botCommand.execute(chatMessage);

    expect(i18n.t).toHaveBeenCalledWith('chat.RequestHelp_spin');

    expect(chatMessage.client.sendMessage).toHaveBeenCalledWith(
      channel.channelName,
      '! SPIN HELP',
    );

    return Promise.resolve();
  });

  it('should return a message if the queue is closed', async () => {
    const channel = getChannelObject();
    channel.queueOpen = false;

    channelRepository.findOneBy.mockImplementation(() => {
      return channel;
    });

    const chatMessage = getChatMessageObject();
    chatMessage.message = '!req test';

    i18n.t.mockImplementation(() => {
      return 'Queue Closed';
    });

    messageFormatterService.formatMessage.mockImplementation((message) => {
      return '! ' + message;
    });

    await botCommand.execute(chatMessage);

    expect(i18n.t).toHaveBeenCalledWith('chat.SorryQueueIsClosed');

    expect(chatMessage.client.sendMessage).toHaveBeenCalledWith(
      channel.channelName,
      '! Queue Closed',
    );

    return Promise.resolve();
  });

  it('should send an error message when search throws an error', async () => {
    const channel = getChannelObject();

    channelRepository.findOneBy.mockImplementation(() => {
      return channel;
    });

    const chatMessage = getChatMessageObject();
    chatMessage.message = '!req test';

    i18n.t.mockImplementation(() => {
      return 'Search Error';
    });

    messageFormatterService.formatMessage.mockImplementation((message) => {
      return '! ' + message;
    });

    songService.searchSongs.mockImplementation(() => {
      throw new Error('search failed');
    });

    await botCommand.execute(chatMessage);

    expect(i18n.t).toHaveBeenCalledWith('chat.SearchErrorTryAgain', {
      lang: 'en',
    });

    expect(chatMessage.client.sendMessage).toHaveBeenCalledWith(
      channel.channelName,
      '! Search Error',
    );

    return Promise.resolve();
  });

  xit('should add song to the queue if only one result is found', async () => {});
  xit('should send a message with multiple results, storing the results for later selection', async () => {});
  xit('should show x more songs if there are more than 5 songs in the results', async () => {});
  xit('should add a song from a previous search by # to the request queue', async () => {});
  xit('should match multiple triggers', () => {});
  xit('should send a message that the song is already in the queue', async () => {});
});
