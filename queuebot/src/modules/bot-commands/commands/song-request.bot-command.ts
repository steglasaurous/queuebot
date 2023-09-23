import { BotCommandInterface } from './bot-command.interface';
import { ChatMessage } from '../../chat/services/chat-message';
import { SongService } from '../../song-store/services/song.service';
import { BotStateService } from '../services/bot-state.service';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { SongRequestErrorType } from '../../song-request/models/song-request-error-type.enum';
import { Song } from '../../data-store/entities/song.entity';
import { MessageFormatterService } from '../services/message-formatter.service';
import { Game } from '../../data-store/entities/game.entity';
// import { I18nTranslations } from '../../../generated/i18n.generated';

export class SongRequestBotCommand implements BotCommandInterface {
  private requestTriggers = [
    '!req',
    '!srr',
    '!bsr',
    '!ssr',
    '!request',
    '!atr',
  ];
  private logger: Logger = new Logger(this.constructor.name);
  constructor(
    private songService: SongService,
    private botStateService: BotStateService,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    private readonly i18n: I18nService,
    private songRequestService: SongRequestService,
    private messageFormatterService: MessageFormatterService,
  ) {}
  async execute(chatMessage: ChatMessage): Promise<void> {
    // Load the channel object so we know what game we're searching requests for.
    const channel = await this.channelRepository.findOneBy({
      channelName: chatMessage.channelName,
    });

    if (!channel) {
      this.logger.warn('Unable to process song request - channel not found', {
        channelName: chatMessage.channelName,
        requesterName: chatMessage.username,
        message: chatMessage.message,
      });
      return;
    }

    if (!channel.enabled) {
      return; // We've been told to turn off. Don't do anything.
    }

    // Load bot state for this user, if any.
    const userBotState = await this.botStateService.getState(
      chatMessage.username,
      chatMessage.channelName,
    );

    // If the request is in the form of "#1", "#2", etc, this is to choose from a list of songs prior.  Otherwise treat this as
    // a new request.

    // New request.
    if (chatMessage.message.indexOf(' ') == -1) {
      // No search term.  Display help.
      if (channel.game) {
        await chatMessage.client.sendMessage(
          chatMessage.channelName,
          this.messageFormatterService.formatMessage(
            this.i18n.t(this.getHelpMessageTranslationKey(channel.game)),
          ),
        );
        return;
      }
    }

    // If the queue is closed, let them know and stop.
    if (
      !channel.queueOpen &&
      !chatMessage.userIsBroadcaster &&
      !chatMessage.userIsMod
    ) {
      await chatMessage.client.sendMessage(
        chatMessage.channelName,
        this.messageFormatterService.formatMessage(
          this.i18n.t('chat.SorryQueueIsClosed'),
        ),
      );
      return;
    }

    const searchTerms = chatMessage.message
      .trim()
      .substring(chatMessage.message.indexOf(' ') + 1)
      .trim();

    const searchSongNumberResult = searchTerms.match(/^#(?<songNumber>[0-9]?)/);
    if (searchSongNumberResult && userBotState.state) {
      const previousResults = userBotState.state['lastQueryResults'];

      let matchedSong: Song | undefined;
      if (previousResults) {
        matchedSong =
          previousResults[
            parseInt(searchSongNumberResult.groups.songNumber) - 1
          ];

        if (matchedSong !== undefined) {
          return await this.addSongToQueue(channel, chatMessage, matchedSong);
        }
      }
      await chatMessage.client.sendMessage(
        chatMessage.channelName,
        this.messageFormatterService.formatMessage(
          this.i18n.t('chat.NoSongsFound', { lang: channel.lang }),
        ),
      );

      return;
    }

    let searchResults: Song[];
    try {
      searchResults = await this.songService.searchSongs(
        searchTerms,
        channel.game,
      );
    } catch (err) {
      this.logger.warn('searchSongs returned an error', err);

      // Let the user know something borked and try again.
      await chatMessage.client.sendMessage(
        chatMessage.channelName,
        this.messageFormatterService.formatMessage(
          this.i18n.t('chat.SearchErrorTryAgain', { lang: channel.lang }),
        ),
      );
      return;
    }

    if (searchResults.length < 1) {
      await chatMessage.client.sendMessage(
        chatMessage.channelName,
        this.messageFormatterService.formatMessage(
          this.i18n.t('chat.NoSongsFound', { lang: channel.lang }),
        ),
      );

      return;
    }

    if (searchResults.length == 1) {
      // Only one? perfect! Let's throw it in the queue.
      return await this.addSongToQueue(channel, chatMessage, searchResults[0]);
    } else if (searchResults.length > 1) {
      this.botStateService.setState(
        chatMessage.username,
        chatMessage.channelName,
        { lastQueryResults: searchResults },
      );

      let outputMessage = this.i18n.t('chat.SelectSong', {
        lang: channel.lang,
      });
      let songLimit = 5;
      if (searchResults.length < 5) {
        songLimit = searchResults.length;
      }
      for (let i = 0; i < songLimit; i++) {
        outputMessage += `#${i + 1} ${searchResults[i].title} - ${
          searchResults[i].artist
        } (${searchResults[i].mapper}) `;
      }
      if (searchResults.length > songLimit) {
        outputMessage += this.i18n.t('chat.AndMore', {
          args: { songsRemaining: searchResults.length - songLimit },
        });
      }

      await chatMessage.client.sendMessage(
        chatMessage.channelName,
        this.messageFormatterService.formatMessage(outputMessage),
      );

      return;
    }

    return;
  }

  matchesTrigger(chatMessage: ChatMessage): boolean {
    let result = false;
    const cleanedChatMessage = chatMessage.message.toLowerCase();

    this.requestTriggers.forEach((requestTrigger) => {
      // We intentionally look for a space after the command so it doesn't accidentially match other commands like
      // !requestobot on
      // We also test for an exact match, which is an opportunity to show some help.
      if (
        cleanedChatMessage.startsWith(requestTrigger + ' ') ||
        cleanedChatMessage == requestTrigger
      ) {
        result = true;
      }
    });

    return result;
  }

  private async addSongToQueue(
    channel: Channel,
    chatMessage: ChatMessage,
    song: Song,
  ) {
    const requestResult = await this.songRequestService.addRequest(
      song,
      channel,
      chatMessage.username,
    );
    if (requestResult.success == false) {
      if (requestResult.errorType == SongRequestErrorType.ALREADY_IN_QUEUE) {
        await chatMessage.client.sendMessage(
          chatMessage.channelName,
          this.messageFormatterService.formatMessage(
            this.i18n.t('chat.SongAlreadyInQueue', {
              lang: channel.lang,
              defaultValue: 'Song is already in queue.',
            }),
          ),
        );
        return;
      } else if (
        requestResult.errorType == SongRequestErrorType.ALREADY_PLAYED
      ) {
        await chatMessage.client.sendMessage(
          chatMessage.channelName,
          this.messageFormatterService.formatMessage(
            this.i18n.t('chat.SongAlreadyPlayed', {
              lang: channel.lang,
              defaultValue: 'Song has already been played.',
            }),
          ),
        );
        return;
      } else {
        await chatMessage.client.sendMessage(
          chatMessage.channelName,
          this.messageFormatterService.formatMessage(
            this.i18n.t('chat.SongRequestFailed', {
              lang: channel.lang,
              defaultValue:
                'Queuebot error while attempting to add song to queue.',
            }),
          ),
        );
        return;
      }
    }

    await chatMessage.client.sendMessage(
      chatMessage.channelName,
      this.messageFormatterService.formatMessage(
        this.i18n.t('chat.SongAddedToQueue', {
          lang: channel.lang,
          args: {
            title: song.title,
            artist: song.artist,
          },
        }),
      ),
    );

    return;
  }

  private getHelpMessageTranslationKey(game: Game) {
    return 'chat.RequestHelp_' + game.name;
  }
}
