import {ChatMessageReceiveEvent} from "../../chat/services/events/chat-message-receive.event";
import {OnEvent} from "@nestjs/event-emitter";
import {BotCommandInterface} from "../commands/bot-command.interface";
import {Inject, Injectable, Logger} from "@nestjs/common";

@Injectable()
export class BotCommandListener {
    private logger: Logger = new Logger(BotCommandListener.name);

    constructor(@Inject('BOT_COMMANDS') private botCommands: BotCommandInterface[]) {}

    @OnEvent(ChatMessageReceiveEvent.name)
    async handle(chatEvent: ChatMessageReceiveEvent) {
        for (const botCommand of this.botCommands) {
            if (botCommand.matchesTrigger(chatEvent.chatMessage)) {
                this.logger.debug('Executing command', { botCommand: botCommand.constructor.name, username: chatEvent.chatMessage.username });
                await botCommand.execute(chatEvent.chatMessage);
            }
        }
    }
}