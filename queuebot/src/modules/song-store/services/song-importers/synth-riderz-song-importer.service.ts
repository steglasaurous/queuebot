import { Injectable, Logger } from '@nestjs/common';
import { SongImporter } from './song-importer.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../../../data-store/entities/game.entity';
import { Repository } from 'typeorm';
import { SongService } from '../song.service';
import { HttpService } from '@nestjs/axios';

// Z API documented here: https://synthriderz.com/api
@Injectable()
export class SynthRiderzSongImporterService implements SongImporter {
  gameName: 'synth_riders';
  private logger: Logger = new Logger(this.constructor.name);
  private game: Game;
  private baseUrl = 'https://synthriderz.com';

  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private songService: SongService,
    private readonly httpService: HttpService,
  ) {}

  importSongs(): Promise<number> {
    return new Promise<number>(async (resolve, reject) => {
      this.game = await this.gameRepository.findOneBy({ name: 'synth_riders' });

      this.httpService
        .get(`${this.baseUrl}/api/beatmaps?sortBy=published_at,DESC`)
        .subscribe({
          next: async (response) => {
            let importedSongCount = 0;

            for (const parsedSong of response.data) {
              const song = await this.songService.saveSong(
                this.songService.createSongEntity(
                  this.game,
                  parsedSong.title,
                  parsedSong.artist,
                  parsedSong.mapper,
                  parsedSong.hash,
                  `${this.baseUrl}${parsedSong.download_url}`,
                  parseInt(parsedSong.bpm),
                  undefined, // parsedSong.duration - needs conversion from time to number
                  undefined, // Technically it's assembled as: id-artist-title-mapper.synth with dashes for spaces
                  `${this.baseUrl}${parsedSong.cover_url}`,
                ),
              );

              // If the created datetime of this song is more than 10 seconds old, consider it
              // an existing song and stop processing.
              if (Date.now() - song.createdOn.getTime() > 10000) {
                break;
              }

              importedSongCount++;
            }
            resolve(importedSongCount);
          },
          error: (err) => {
            this.logger.warn(
              'Request to synthriderz api failed: ' + err.toString(),
            );
            resolve(0);
          },
        });
    });
  }
}
