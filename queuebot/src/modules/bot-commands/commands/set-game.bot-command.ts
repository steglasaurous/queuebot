import { ChatMessage } from '../../chat/services/chat-message';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { Game } from '../../data-store/entities/game.entity';
import { MessageFormatterService } from '../services/message-formatter.service';
import { I18nService } from 'nestjs-i18n';
import { BaseBotCommand } from './base.bot-command';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SetGameBotCommand extends BaseBotCommand {
  constructor(
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private i18n: I18nService,
  ) {
    super();
    this.triggers = ['!setgame'];
  }

  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    // We'll use the display name to match what game to set the channel to.
    // Only mods and broadcasters can use this
    if (!chatMessage.userIsBroadcaster && !chatMessage.userIsMod) {
      return;
    }

    // Try to find the game specified.
    const inputGameName = chatMessage.message
      .toLowerCase()
      .replace('!setgame', '')
      .trim();
    if (!inputGameName) {
      // FIXME: change this to show the currently set game
      return this.i18n.t('chat.NoGameSpecified');
    }

    const gameSearchResults = await this.gameRepository.findBy({
      setGameName: inputGameName,
    });
    if (gameSearchResults.length > 1) {
      return this.i18n.t('chat.MatchedTooManyGames');
    }

    if (gameSearchResults.length < 1) {
      return this.i18n.t('chat.UnsupportedGame');
    }

    channel.game = gameSearchResults[0];
    await this.channelRepository.save(channel);
    return this.i18n.t('chat.GameChanged', {
      lang: channel.lang,
      args: { gameName: channel.game.displayName },
    });
  }

  getDescription(): string {
    return "Set the game the bot should search requests with. This would be the game name similar to how you'd see it on Twitch. Examples: **!setgame audio trip**, **!setgame spin rhythm xd**";
  }
}
