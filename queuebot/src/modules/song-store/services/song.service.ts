import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Song } from '../../data-store/entities/song.entity';
import { Game } from '../../data-store/entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'node:crypto';
import { SongSearchStrategyInterface } from './song-search-strategies/song-search-strategy.interface';
import { SONG_SEARCH_STRATEGIES } from '../song-store.module';

@Injectable()
export class SongService {
  private hashes: string[] = [];
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @Inject(SONG_SEARCH_STRATEGIES)
    private searchStrategies: SongSearchStrategyInterface[],
  ) {}

  async searchSongs(query: string, game: Game): Promise<Song[]> {
    // FUTURE IMPROVEMENTS:
    //   Full-text search of title, artist and mapper
    //   Modifiers like -title sometitle, -artist someartist, -mapper somemapper or in some fashion, directly by -id ?
    for (const strategy of this.searchStrategies) {
      if (strategy.supportsGame(game)) {
        return await strategy.search(game, query);
      }
    }

    return [];
  }
  async saveSong(
    game: Game,
    title: string,
    artist: string,
    mapper: string,
    hash?: string,
  ): Promise<Song> {
    // If there's no hash, generate it first.  That's how we determine if we already have the song.
    if (!hash) {
      hash = crypto
        .createHash('sha256')
        .update(JSON.stringify(game.name + title + artist + mapper))
        .digest('hex');
    }

    // Because this all happens asyncronously, we can have a shitload of inserts happening
    // all at once.  This helps to deal with dupes within the dataset itself (of which do exist in sources like
    // the audio trip spreadsheet.
    if (this.hashes.includes(hash)) {
      return;
    }

    this.hashes.push(hash);

    let song: Song;
    song = await this.songRepository.findOneBy({ songHash: hash });

    if (!song) {
      song = new Song();
      song.game = game;
      song.songHash = hash;
      song.artist = artist;
      song.title = title;
      song.mapper = mapper;

      song = await this.songRepository.save(song);
    }

    return song;
  }
}
