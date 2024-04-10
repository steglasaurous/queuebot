import { SongImporter } from './song-importer.interface';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../../../data-store/entities/game.entity';
import { Repository } from 'typeorm';
import { SongService } from '../song.service';

@Injectable()
export class SpinRhythmSongImporterService implements SongImporter {
  gameName = 'spin_rhythm';
  // FIXME: Shouldn't rely on this in perpetuity - it's marked as deprecated on the spinsha.re site.
  private spinshareSearchAllUrl = 'https://spinsha.re/api/searchAll';

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private songService: SongService,
  ) {}

  importSongs(): Promise<number> {
    return new Promise<number>(async (resolve, reject) => {
      const game = await this.gameRepository.findOneBy({ name: this.gameName });
      this.httpService.get(this.spinshareSearchAllUrl).subscribe({
        next: async (response) => {
          for (const parsedSong of response.data.data.songs) {
            await this.songService.saveSong(
              this.songService.createSongEntity(
                game,
                parsedSong.title,
                parsedSong.artist,
                parsedSong.charter,
                parsedSong.id,
                parsedSong.zip,
                undefined,
                undefined,
                parsedSong.fileReference,
                parsedSong.cover,
              ),
            );
          }
          resolve(response.data.data.songs.length);
        },
        error: (e) => {
          reject(e);
        },
      });
    });
  }
}
