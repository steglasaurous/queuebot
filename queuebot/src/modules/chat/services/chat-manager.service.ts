import { Inject, Injectable, Logger } from '@nestjs/common';
import { AbstractChatClient } from './clients/abstract-chat.client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatMessageReceiveEvent } from '../events/chat-message-receive.event';
import { ChatClientConnectedEvent } from '../events/chat-client-connected.event';

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

  public addChatClient(chatClient: AbstractChatClient) {
    chatClient.messages$.subscribe((chatMessage) => {
      this.eventEmitter.emit(ChatMessageReceiveEvent.name, {
        chatMessage: chatMessage,
      } as ChatMessageReceiveEvent);
    });

    this.chatClients.push(chatClient);
  }

  public async connectAll() {
    for (const chatClient of this.chatClients) {
      await chatClient.connect();
      this.logger.log('Connected');
    }
  }
}
