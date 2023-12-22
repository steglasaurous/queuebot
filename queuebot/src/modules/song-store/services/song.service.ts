import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Song } from '../../data-store/entities/song.entity';
import { Game } from '../../data-store/entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'node:crypto';
import { SongSearchStrategyInterface } from './song-search-strategies/song-search-strategy.interface';
import { SONG_SEARCH_STRATEGIES } from '../injection-tokens';

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

  createSongEntity(
    game: Game,
    title: string,
    artist: string,
    mapper: string,
    hash?: string,
    downloadUrl?: string,
    bpm?: number,
    duration?: number,
    fileReference?: string,
  ): Song {
    if (!hash) {
      hash = crypto
        .createHash('sha256')
        .update(JSON.stringify(game.name + title + artist + mapper))
        .digest('hex');
    }

    const song = new Song();
    song.game = game;
    song.songHash = hash;
    song.artist = artist;
    song.title = title;
    song.mapper = mapper;
    song.downloadUrl = downloadUrl;
    song.bpm = bpm;
    song.duration = duration;
    song.fileReference = fileReference;

    return song;
  }

  async saveSong(song: Song): Promise<Song> {
    // Because this all happens asynchronously, we can have a shitload of inserts happening
    // all at once.  This helps to deal with dupes within the dataset itself (of which do exist in sources like
    // the audio trip spreadsheet.
    if (this.hashes.includes(song.songHash)) {
      return;
    }

    this.hashes.push(song.songHash);

    const existingSong = await this.songRepository.findOneBy({
      game: song.game,
      songHash: song.songHash,
    });

    if (existingSong) {
      // Do an update on this.
      existingSong.title = song.title;
      existingSong.artist = song.artist;
      existingSong.mapper = song.mapper;
      existingSong.downloadUrl = song.downloadUrl;
      existingSong.bpm = song.bpm;
      existingSong.duration = song.duration;

      return await this.songRepository.save(existingSong);
    }

    return await this.songRepository.save(song);
  }
}
