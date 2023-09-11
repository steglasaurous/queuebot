import { SongSearchStrategyInterface } from './song-search-strategy.interface';
import { Song } from '../../../data-store/entities/song.entity';
import { Game } from '../../../data-store/entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy implements SongSearchStrategyInterface {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}
  async search(game: Game, query: string): Promise<Song[]> {
    return await this.songRepository.find({
      where: { title: Like('%' + query + '%'), game: game },
    });
  }

  supportsGame(game: Game): boolean {
    switch (game.name) {
      case 'audio_trip':
        return true;
    }

    return false;
  }
}
