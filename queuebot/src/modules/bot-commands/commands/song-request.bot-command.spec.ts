import { Test, TestingModule } from '@nestjs/testing';
import { SongRequestBotCommand } from './song-request.bot-command';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { getGenericNestMock } from '../../../../test/helpers';
import { BotStateService } from '../services/bot-state.service';
import { I18nService } from 'nestjs-i18n';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { AbstractChatClient } from '../../chat/services/clients/abstract-chat.client';
import { Game } from '../../data-store/entities/game.entity';
import { ChatMessage } from '../../chat/services/chat-message';
import { SongService } from '../../song-store/services/song.service';

describe('SongRequestBotCommand', () => {
  let service: SongRequestBotCommand;
  let botStateService;
  let i18n;
  let songRequestService;
  let songService;
  let channel;
  let chatMessage;

  const getChatMessageObject = (): ChatMessage => {
    return {
      channelName: 'testchannel',
      client: {
        sendMessage: jest.fn(),
      } as unknown as AbstractChatClient,
      message: '!req somesong',
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
          provide: BotStateService,
          useValue: {
            getState: jest.fn(),
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

    service = module.get<SongRequestBotCommand>(SongRequestBotCommand);
    botStateService = module.get<BotStateService>(BotStateService);
    i18n = module.get(I18nService);
    i18n.t.mockImplementation((key: string) => {
      return key;
    });

    songRequestService = module.get(SongRequestService);
    songService = module.get(SongService);

    const game = new Game();
    game.id = 1;
    game.name = 'spin';

    channel = new Channel();
    channel.enabled = true;
    channel.queueOpen = true;
    channel.channelName = 'testchannel';
    channel.game = game;
    channel.lang = 'en';

    chatMessage = {
      channelName: 'testchannel',
      client: {
        sendMessage: jest.fn(),
      } as unknown as AbstractChatClient,
      message: '!req somesong',
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a description', () => {
    expect(service.getDescription()).toBeDefined();
  });

  it('should display a help message relevant to the current game if no search terms are present', async () => {
    chatMessage.message = '!req';

    const response = await service.execute(channel, chatMessage);

    expect(response).toEqual('chat.RequestHelp_spin');
    expect(i18n.t).toHaveBeenCalledWith('chat.RequestHelp_spin', {
      lang: 'en',
    });

    return Promise.resolve();
  });

  it('should return a message if the queue is closed', async () => {
    channel.queueOpen = false;
    chatMessage.message = '!req test';

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.SorryQueueIsClosed');
    expect(i18n.t).toHaveBeenCalledWith('chat.SorryQueueIsClosed', {
      lang: 'en',
    });

    return Promise.resolve();
  });

  it('should send an error message when search throws an error', async () => {
    chatMessage.message = '!req test';
    songService.searchSongs.mockImplementation(() => {
      throw new Error('search failed');
    });

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.SearchErrorTryAgain');
    expect(i18n.t).toHaveBeenCalledWith('chat.SearchErrorTryAgain', {
      lang: 'en',
    });

    return Promise.resolve();
  });

  it('should return no songs found if search returned with no results', async () => {
    songService.searchSongs.mockReturnValue([]);
    const response = await service.execute(channel, chatMessage);

    expect(response).toEqual('chat.NoSongsFound');
    expect(i18n.t).toHaveBeenCalledWith('chat.NoSongsFound', { lang: 'en' });
  });

  xit('should add song to the queue if only one result is found', async () => {
    songService.searchSongs.mockReturnValue([]);
  });
  xit('should send a message with multiple results, storing the results for later selection', async () => {});
  xit('should show x more songs if there are more than 5 songs in the results', async () => {});
  xit('should add a song from a previous search by # to the request queue', async () => {});
  xit('should match multiple triggers', () => {});
  xit('should send a message that the song is already in the queue', async () => {});
});
