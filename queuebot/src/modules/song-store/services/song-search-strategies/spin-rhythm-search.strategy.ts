import { SongSearchStrategyInterface } from './song-search-strategy.interface';
import { Song } from '../../../data-store/entities/song.entity';
import { Game } from '../../../data-store/entities/game.entity';
import { HttpService } from '@nestjs/axios';

export class SpinRhythmSearchStrategy implements SongSearchStrategyInterface {
  constructor(private httpService: HttpService) {}

  async search(game: Game, query: string): Promise<Song[]> {
    return new Promise<Song[]>((resolve) => {
      this.httpService
        .post('https://spinsha.re/api/searchCharts', {
          searchQuery: query,
        })
        .subscribe((result) => {
          // Parse results, but get about 10 results.  Don't try to boil the ocean.
          console.log(result.data);
          const songs: Song[] = result.data.data.map((resultItem) => {
            const song = new Song();
            song.game = game;
            song.songHash = resultItem.id;
            song.title = resultItem.title;
            song.artist = resultItem.artist;
            song.mapper = resultItem.charter;
            // No bpm or duration - future consideration: Pull down the song in a separate async process and pick it out of the song itself?
            return song;
          });

          resolve(songs);
          return;
        });
    });
  }

  supportsGame(game: Game): boolean {
    return game.name == 'spin_rhythm';
  }
}
