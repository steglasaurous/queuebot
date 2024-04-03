import { Inject, Injectable, Logger } from '@nestjs/common';
import { AbstractChatClient } from './clients/abstract-chat.client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatMessageReceiveEvent } from '../events/chat-message-receive.event';

@Injectable()
export class ChatManagerService {
  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    private eventEmitter: EventEmitter2,
    @Inject('ChatClients') private chatClients: AbstractChatClient[] = [],
  ) {
    chatClients.forEach((chatClient) => {
      chatClient.messages$.subscribe((chatMessage) => {
        this.eventEmitter.emit(ChatMessageReceiveEvent.name, {
          chatMessage: chatMessage,
        } as ChatMessageReceiveEvent);
      });
    });

    this.connectAll();
  }

  public async connectAll() {
    for (const chatClient of this.chatClients) {
      await chatClient.connect();
      this.logger.log('Connected');
    }
  }

  /**
   * Sends a message to a channel.  Note this works by calling on ALL clients to send the message.  It's up
   * to each client to decide whether it should send the message or not.
   *
   * @param channelName
   * @param message
   */
  public async sendMessage(channelName: string, message: string) {
    for (const chatClient of this.chatClients) {
      await chatClient.sendMessage(channelName, message);
    }
  }
}
