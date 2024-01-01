import { Test, TestingModule } from '@nestjs/testing';
import { getGenericNestMock } from '../../../../test/helpers';
import { Channel } from '../../data-store/entities/channel.entity';
import { ChatMessage } from '../../chat/services/chat-message';
import { I18nService } from 'nestjs-i18n';
import { GetOutBotCommand } from './get-out.bot-command';
import { AbstractChatClient } from '../../chat/services/clients/abstract-chat.client';
import { getToken } from '@willsoto/nestjs-prometheus';
import { Metrics } from '../models/metrics.enum';

describe('Get out bot command', () => {
  let service: GetOutBotCommand;
  let i18nMock;
  const channelRepositoryMock = {
    save: jest.fn(),
  };
  let channelLeftCounterTotal;
  let channelsJoinedTotal;
  let channelsBotEnabledTotal;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetOutBotCommand],
    })
      .useMocker((token) => {
        switch (token) {
          case 'ChannelRepository':
            return channelRepositoryMock;
          // FIXME: Add prom metrics
          case getToken(Metrics.ChannelLeftCounterTotal):
          case getToken(Metrics.ChannelsJoinedTotal):
          case getToken(Metrics.ChannelsBotEnabledTotal):
            return {
              inc: jest.fn(),
              dec: jest.fn(),
            };

          // return token;
          default:
            return getGenericNestMock(token);
        }
      })
      .compile();

    service = module.get(GetOutBotCommand);
    i18nMock = module.get(I18nService);
    channelLeftCounterTotal = module.get(
      getToken(Metrics.ChannelLeftCounterTotal),
    );
    channelsJoinedTotal = module.get(getToken(Metrics.ChannelsJoinedTotal));
    channelsBotEnabledTotal = module.get(
      getToken(Metrics.ChannelsBotEnabledTotal),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should close the queue if it is open, and the user is a broadcaster', async () => {
    const channel = new Channel();
    channel.inChannel = true;
    channel.lang = 'en';

    const chatMessage = {
      userIsBroadcaster: true,
      userIsMod: false,
      client: {
        sendMessage: jest.fn(),
        leaveChannel: jest.fn(),
      } as unknown as AbstractChatClient,
    } as unknown as ChatMessage;

    i18nMock.t.mockReturnValue('chat.ImOut');
    const response = await service.execute(channel, chatMessage);

    expect(i18nMock.t).toHaveBeenCalledWith('chat.ImOut', { lang: 'en' });
    expect(channelRepositoryMock.save).toHaveBeenCalled();
    expect(channelRepositoryMock.save.mock.calls[0][0].inChannel).toEqual(
      false,
    );
    expect(channelRepositoryMock.save.mock.calls[0][0].leftOn).toBeInstanceOf(
      Date,
    );
    expect(channelLeftCounterTotal.inc).toHaveBeenCalled();
    expect(channelsJoinedTotal.dec).toHaveBeenCalled();
    expect(channelsBotEnabledTotal.dec).toHaveBeenCalled();

    expect(response).toEqual(undefined);
  });

  it('should ignore the command if user is not a broadcaster or mod', async () => {
    const channel = new Channel();

    const chatMessage = {
      userIsBroadcaster: false,
      userIsMod: false,
      client: {
        sendMessage: jest.fn(),
        leaveChannel: jest.fn(),
      } as unknown as AbstractChatClient,
    } as unknown as ChatMessage;

    await service.execute(channel, chatMessage);
    expect(chatMessage.client.sendMessage).not.toHaveBeenCalled();
    expect(chatMessage.client.leaveChannel).not.toHaveBeenCalled();
    expect(channelRepositoryMock.save).not.toHaveBeenCalled();
    expect(channelLeftCounterTotal.inc).not.toHaveBeenCalled();
    expect(channelsJoinedTotal.dec).not.toHaveBeenCalled();
    expect(channelsBotEnabledTotal.dec).not.toHaveBeenCalled();
  });

  it('should always trigger regardless if the bot is enabled or not', () => {
    expect(service.shouldAlwaysTrigger()).toBeTruthy();
  });
});
