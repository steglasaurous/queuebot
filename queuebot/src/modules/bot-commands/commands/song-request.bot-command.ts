import { ChatMessage } from '../../chat/services/chat-message';
import { SongService } from '../../song-store/services/song.service';
import { BotStateService } from '../services/bot-state.service';
import { Channel } from '../../data-store/entities/channel.entity';
import { Inject, Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { SongRequestErrorType } from '../../song-request/models/song-request-error-type.enum';
import { Song } from '../../data-store/entities/song.entity';
import { Game } from '../../data-store/entities/game.entity';
import { BaseBotCommand } from './base.bot-command';

export class SongRequestBotCommand extends BaseBotCommand {
  private logger: Logger = new Logger(this.constructor.name);
  constructor(
    private songService: SongService,
    // NOTE: Added @Inject here as BotStateService wasn't getting instantiated before this class was.
    // Adding @Inject() makes an explicit reference to the dependency that NestJS seems to resolve.
    @Inject(BotStateService) private botStateService: BotStateService,
    private readonly i18n: I18nService,
    private songRequestService: SongRequestService,
  ) {
    super();

    this.triggers = ['!req', '!srr', '!bsr', '!ssr', '!request', '!atr'];
  }
  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
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
        return this.i18n.t(this.getHelpMessageTranslationKey(channel.game));
      }
    }

    // If the queue is closed, let them know and stop.
    if (
      !channel.queueOpen &&
      !chatMessage.userIsBroadcaster &&
      !chatMessage.userIsMod
    ) {
      return this.i18n.t('chat.SorryQueueIsClosed', { lang: channel.lang });
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

      return this.i18n.t('chat.NoSongsFound', { lang: channel.lang });
    }

    let searchResults: Song[];
    try {
      searchResults = await this.songService.searchSongs(
        searchTerms,
        channel.game,
      );
    } catch (err) {
      this.logger.warn('searchSongs returned an error', err); // FIXME: put more context around the error.

      // Let the user know something borked and try again.
      return this.i18n.t('chat.SearchErrorTryAgain', { lang: channel.lang });
    }

    if (searchResults.length < 1) {
      return this.i18n.t('chat.NoSongsFound', { lang: channel.lang });
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

      return outputMessage;
    }
  }
  getDescription(): string {
    return 'Add a song request to the queue. Use the song title to request a song. If more than one song matches, you will be presented with a list of matches, and can respond with **!req #1** to select the first song, **!req #2** to select the second song, etc.';
  }
  private async addSongToQueue(
    channel: Channel,
    chatMessage: ChatMessage,
    song: Song,
  ): Promise<string> {
    const requestResult = await this.songRequestService.addRequest(
      song,
      channel,
      chatMessage.username,
    );
    if (requestResult.success == false) {
      if (requestResult.errorType == SongRequestErrorType.ALREADY_IN_QUEUE) {
        return this.i18n.t('chat.SongAlreadyInQueue', {
          lang: channel.lang,
          defaultValue: 'Song is already in queue.',
        });
      } else if (
        requestResult.errorType == SongRequestErrorType.ALREADY_PLAYED
      ) {
        return this.i18n.t('chat.SongAlreadyPlayed', {
          lang: channel.lang,
          defaultValue: 'Song has already been played.',
        });
      } else {
        return this.i18n.t('chat.SongRequestFailed', {
          lang: channel.lang,
          defaultValue: 'Queuebot error while attempting to add song to queue.',
        });
      }
    }

    return this.i18n.t('chat.SongAddedToQueue', {
      lang: channel.lang,
      args: {
        title: song.title,
        artist: song.artist,
      },
    });
  }

  private getHelpMessageTranslationKey(game: Game) {
    return 'chat.RequestHelp_' + game.name;
  }
}
