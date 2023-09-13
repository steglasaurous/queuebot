import { BotCommandInterface } from './bot-command.interface';
import { ChatMessage } from '../../chat/services/chat-message';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { Game } from '../../data-store/entities/game.entity';
import { MessageFormatterService } from '../services/message-formatter.service';
import { I18nService } from 'nestjs-i18n';

export class SetGameBotCommand implements BotCommandInterface {
  constructor(
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private messageFormatter: MessageFormatterService,
    private i18n: I18nService,
  ) {}

  async execute(chatMessage: ChatMessage): Promise<void> {
    // We'll use the display name to match what game to set the channel to.
    // Only mods and broadcasters can use this
    if (!chatMessage.userIsBroadcaster && !chatMessage.userIsMod) {
      return;
    }

    const channel = await this.channelRepository.findOneBy({
      channelName: chatMessage.channelName,
    });
    if (!channel.enabled) {
      return; // We've been told to turn off. Don't do anything.
    }

    // Try to find the game specified.
    const inputGameName = chatMessage.message
      .toLowerCase()
      .replace('!setgame', '')
      .trim();
    if (!inputGameName) {
      await chatMessage.client.sendMessage(
        chatMessage.channelName,
        this.messageFormatter.formatMessage(
          this.i18n.t('chat.NoGameSpecified'),
        ),
      );
      return;
    }

    const gameSearchResults = await this.gameRepository.findBy({
      setGameName: inputGameName,
    });
    if (gameSearchResults.length > 1) {
      await chatMessage.client.sendMessage(
        chatMessage.channelName,
        this.messageFormatter.formatMessage(
          this.i18n.t('chat.MatchedTooManyGames'),
        ),
      );
      return;
    }

    if (gameSearchResults.length < 1) {
      await chatMessage.client.sendMessage(
        chatMessage.channelName,
        this.messageFormatter.formatMessage(
          this.i18n.t('chat.UnsupportedGame'),
        ),
      );
      return;
    }

    channel.game = gameSearchResults[0];
    await this.channelRepository.save(channel);
    await chatMessage.client.sendMessage(
      chatMessage.channelName,
      this.messageFormatter.formatMessage(
        this.i18n.t('chat.GameChanged', {
          args: { gameName: channel.game.displayName },
        }),
      ),
    );
    return;
  }

  matchesTrigger(chatMessage: ChatMessage): boolean {
    return chatMessage.message.toLowerCase().startsWith('!setgame');
  }
}
