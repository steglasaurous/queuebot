import {ChatMessage} from "../../chat/services/chat-message";

export interface BotCommandInterface {
    matchesTrigger(chatMessage: ChatMessage): boolean;
    execute(chatMessage: ChatMessage): Promise<void>;
}