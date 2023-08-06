import {ChatMessage} from "../../chat/services/chat-message";

export interface BotCommandInterface {
    matchesTrigger(message: string): boolean;
    execute(chatMessage: ChatMessage): Promise<void>;
}