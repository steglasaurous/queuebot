import { Test, TestingModule } from '@nestjs/testing';
import { getGenericNestMock } from '../../../../test/helpers';
import { ClearBotCommand } from './clear.bot-command';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { Channel } from '../../data-store/entities/channel.entity';
import { ChatMessage } from '../../chat/services/chat-message';
import { I18nService } from 'nestjs-i18n';

describe('Clear bot command', () => {
  let service: ClearBotCommand;
  let songRequestServiceMock;
  let i18nMock;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClearBotCommand],
    })
      .useMocker((token) => {
        return getGenericNestMock(token);
      })
      .compile();

    service = module.get(ClearBotCommand);
    songRequestServiceMock = module.get(SongRequestService);
    i18nMock = module.get(I18nService);
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should clear the queue if user is a broadcaster', async () => {
    const channel = new Channel();
    const chatMessage = {
      userIsBroadcaster: true,
      userIsMod: false,
    } as unknown as ChatMessage;
    i18nMock.t.mockReturnValue('chat.QueueCleared');
    const response = await service.execute(channel, chatMessage);
    expect(i18nMock.t).toHaveBeenCalledWith('chat.QueueCleared');
    expect(songRequestServiceMock.clearAllRequests).toHaveBeenCalledWith(
      channel,
    );
    expect(response).toEqual('chat.QueueCleared');
  });

  it('should clear the queue if user is a moderator', async () => {
    const channel = new Channel();
    const chatMessage = {
      userIsBroadcaster: false,
      userIsMod: true,
    } as unknown as ChatMessage;
    i18nMock.t.mockReturnValue('chat.QueueCleared');
    const response = await service.execute(channel, chatMessage);
    expect(i18nMock.t).toHaveBeenCalledWith('chat.QueueCleared');
    expect(songRequestServiceMock.clearAllRequests).toHaveBeenCalledWith(
      channel,
    );
    expect(response).toEqual('chat.QueueCleared');
  });

  it('should not respond if the user is not a broadcaster or a moderator', async () => {
    const channel = new Channel();
    const chatMessage = {
      userIsBroadcaster: false,
      userIsMod: false,
    } as unknown as ChatMessage;

    const response = await service.execute(channel, chatMessage);
    expect(i18nMock.t).not.toHaveBeenCalled();
    expect(songRequestServiceMock.clearAllRequests).not.toHaveBeenCalled();

    expect(response).not.toBeDefined();
  });
});
