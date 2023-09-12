import { SongSearchStrategyInterface } from './song-search-strategy.interface';
import { Song } from '../../../data-store/entities/song.entity';
import { Game } from '../../../data-store/entities/game.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpinRhythmSearchStrategy implements SongSearchStrategyInterface {
  constructor(private readonly httpService: HttpService) {}

  async search(game: Game, query: string): Promise<Song[]> {
    // If we get a number, we can interpret as a search by id and just use that directly.
    // Otherwise, fallback to standard search.
    if (query.match(/^[0-9]*$/)) {
      const songIdResult = await firstValueFrom(
        this.httpService.get('https://spinsha.re/api/song/' + query),
      );
      if (songIdResult.data.data) {
        return [this.getSongFromData(game, songIdResult.data.data)];
      }
    }
    const result = await firstValueFrom(
      this.httpService.post('https://spinsha.re/api/searchCharts', {
        searchQuery: query,
      }),
    );
    // Parse results, but get about 10 results.  Don't try to boil the ocean.
    return result.data.data.map((resultItem) => {
      // No bpm or duration - future consideration: Pull down the song in a separate async process and pick it out of the song itself?
      return this.getSongFromData(game, resultItem);
    });
  }

  supportsGame(game: Game): boolean {
    return game.name == 'spin_rhythm';
  }

  private getSongFromData(game: Game, data: any): Song {
    const song = new Song();
    song.game = game;
    song.songHash = data.id;
    song.title = data.title;
    song.artist = data.artist;
    song.mapper = data.charter;

    return song;
  }
}
