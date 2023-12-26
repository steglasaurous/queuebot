import { BaseBotCommand } from './base.bot-command';
import { Channel } from '../../data-store/entities/channel.entity';
import { ChatMessage } from '../../chat/services/chat-message';

export class RbsetCommand extends BaseBotCommand {
  constructor() {
    super();

    this.triggers = ['!rbset'];
  }
  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    return new Promise<string>((resolve) => {
      resolve('');
    });
  }

  getDescription(): string {
    return '';
  }
}
