import { Test, TestingModule } from '@nestjs/testing';
import { getGenericNestMock } from '../../../../test/helpers';
import { Channel } from '../../data-store/entities/channel.entity';
import { ChatMessage } from '../../chat/services/chat-message';
import { I18nService } from 'nestjs-i18n';
import { CloseBotCommand } from './close.bot-command';

describe('Close queue bot command', () => {
  let service: CloseBotCommand;
  let i18nMock;
  const channelRepositoryMock = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloseBotCommand],
    })
      .useMocker((token) => {
        switch (token) {
          case 'ChannelRepository':
            return channelRepositoryMock;
          default:
            return getGenericNestMock(token);
        }
      })
      .compile();

    service = module.get(CloseBotCommand);

    i18nMock = module.get(I18nService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should close the queue if it is open, and the user is a broadcaster', async () => {
    const channel = new Channel();
    channel.queueOpen = true;
    channel.lang = 'en';

    const chatMessage = {
      userIsBroadcaster: true,
      userIsMod: false,
    } as unknown as ChatMessage;
    i18nMock.t.mockReturnValue('chat.QueueClosed');
    const response = await service.execute(channel, chatMessage);
    expect(i18nMock.t).toHaveBeenCalledWith('chat.QueueClosed', { lang: 'en' });
    expect(channelRepositoryMock.save).toHaveBeenCalled();
    expect(channelRepositoryMock.save.mock.calls[0][0].queueOpen).toEqual(
      false,
    );

    expect(response).toEqual('chat.QueueClosed');
  });

  it('should close the queue if it is open, and the user is a moderator', async () => {
    const channel = new Channel();
    channel.queueOpen = true;
    channel.lang = 'en';

    const chatMessage = {
      userIsBroadcaster: false,
      userIsMod: true,
    } as unknown as ChatMessage;
    i18nMock.t.mockReturnValue('chat.QueueClosed');
    const response = await service.execute(channel, chatMessage);
    expect(i18nMock.t).toHaveBeenCalledWith('chat.QueueClosed', { lang: 'en' });
    expect(channelRepositoryMock.save).toHaveBeenCalled();
    expect(channelRepositoryMock.save.mock.calls[0][0].queueOpen).toEqual(
      false,
    );

    expect(response).toEqual('chat.QueueClosed');
  });

  it('should respond that the queue is already closed', async () => {
    const channel = new Channel();
    channel.queueOpen = false;
    channel.lang = 'en';

    const chatMessage = {
      userIsBroadcaster: true,
      userIsMod: false,
    } as unknown as ChatMessage;
    i18nMock.t.mockReturnValue('chat.QueueAlreadyClosed');
    const response = await service.execute(channel, chatMessage);
    expect(i18nMock.t).toHaveBeenCalledWith('chat.QueueAlreadyClosed', {
      lang: 'en',
    });
    expect(channelRepositoryMock.save).not.toHaveBeenCalled();

    expect(response).toEqual('chat.QueueAlreadyClosed');
  });

  it('should not respond if users is not a broadcaster or moderator', async () => {
    const channel = new Channel();
    channel.queueOpen = false;
    channel.lang = 'en';

    const chatMessage = {
      userIsBroadcaster: false,
      userIsMod: false,
    } as unknown as ChatMessage;

    const response = await service.execute(channel, chatMessage);
    expect(channelRepositoryMock.save).not.toHaveBeenCalled();
    expect(response).toEqual(undefined);
  });
});
