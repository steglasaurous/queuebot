import {Inject, Injectable} from '@nestjs/common';
import { AbstractChatClient } from './clients/abstract-chat.client';
import {EventEmitter2} from "@nestjs/event-emitter";
import {ChatMessageReceiveEvent} from "../events/chat-message-receive.event";

@Injectable()
export class ChatManagerService {
    constructor(private eventEmitter: EventEmitter2, @Inject("ChatClients") private chatClients: AbstractChatClient[] = []) {
        chatClients.forEach((chatClient) => {
            chatClient.messages$.subscribe((chatMessage) => {
                this.eventEmitter.emit(ChatMessageReceiveEvent.name, {
                    chatMessage: chatMessage
                } as ChatMessageReceiveEvent);
            });
        });

        this.connectAll();
    }

    public addChatClient(chatClient: AbstractChatClient) {
        chatClient.messages$.subscribe((chatMessage) => {
            this.eventEmitter.emit(ChatMessageReceiveEvent.name, {
                chatMessage: chatMessage
            } as ChatMessageReceiveEvent);
        });

        this.chatClients.push(chatClient);
    }

    public async connectAll() {
        for (const chatClient of this.chatClients) {
            await chatClient.connect();
        }
    }

    public async sendMessage(channelName: string, message: string) {
        // FIXME: Finish implementing this.

    }
}
