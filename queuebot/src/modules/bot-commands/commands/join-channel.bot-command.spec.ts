import { Test, TestingModule } from '@nestjs/testing';
import { getToken } from '@willsoto/nestjs-prometheus';
import { Metrics } from '../models/metrics.enum';
import { getGenericNestMock } from '../../../../test/helpers';
import { JoinChannelBotCommand } from './join-channel.bot-command';
import { Game } from '../../data-store/entities/game.entity';
import { AbstractChatClient } from '../../chat/services/clients/abstract-chat.client';
import { ChatMessage } from '../../chat/services/chat-message';
import { Channel } from '../../data-store/entities/channel.entity';
import { I18nService } from 'nestjs-i18n';

describe('Join channel bot command', () => {
  const channelRepositoryMock = {
    save: jest.fn(),
    findOneBy: jest.fn(),
  };
  let service: JoinChannelBotCommand;
  let i18n;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JoinChannelBotCommand],
    })
      .useMocker((token) => {
        switch (token) {
          case 'ChannelRepository':
            return channelRepositoryMock;
          case 'GameRepository':
            return {
              findOneBy: jest.fn().mockReturnValue(new Game()),
            };
          case getToken(Metrics.ChannelsTotal):
          case getToken(Metrics.ChannelJoinedCounterTotal):
          case getToken(Metrics.ChannelLeftCounterTotal):
          case getToken(Metrics.ChannelsJoinedTotal):
          case getToken(Metrics.ChannelsBotEnabledTotal):
            return {
              inc: jest.fn(),
              dec: jest.fn(),
            };
          case I18nService:
            return {
              t: jest.fn(),
            };
          case 'BOT_CHANNEL_NAME':
            return token;
          default:
            return getGenericNestMock(token);
        }
      })
      .compile();

    service = module.get(JoinChannelBotCommand);
    i18n = module.get(I18nService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should join a new channel', async () => {
    channelRepositoryMock.findOneBy.mockReturnValue(undefined);
    const channel = new Channel();

    const chatMessage = {
      userIsBroadcaster: false,
      userIsMod: false,
      username: 'steglasaurous',
      client: {
        sendMessage: jest.fn(),
        joinChannel: jest.fn(),
      } as unknown as AbstractChatClient,
    } as unknown as ChatMessage;

    i18n.t
      .mockReturnValueOnce('chat.HelloChannel')
      .mockReturnValueOnce('chat.JoinedChannel');

    const response = await service.execute(channel, chatMessage);
    const channelSaveActual = channelRepositoryMock.save.mock.calls[0][0];
    expect(channelSaveActual.channelName).toEqual(chatMessage.username);
    expect(channelSaveActual.inChannel).toBeTruthy();
    expect(channelSaveActual.joinedOn).toBeInstanceOf(Date);
    expect(channelSaveActual.queueOpen).toBeTruthy();
    expect(channelSaveActual.game).toBeInstanceOf(Game);
    expect(chatMessage.client.joinChannel).toBeCalledWith(chatMessage.username);

    expect(chatMessage.client.sendMessage).toBeCalledWith(
      chatMessage.username,
      'chat.HelloChannel',
    );
  });
});
