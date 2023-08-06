import {BotCommandInterface} from "./bot-command.interface";
import {ChatMessage} from "../../chat/services/chat-message";

export class JoinChannelBotCommand implements BotCommandInterface {
    execute(chatMessage: ChatMessage): Promise<void> {
        return Promise.resolve(undefined);
    }

    matchesTrigger(message: string): boolean {
        return false;
    }

}