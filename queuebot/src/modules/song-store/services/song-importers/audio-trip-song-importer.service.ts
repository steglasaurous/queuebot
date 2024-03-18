import { Injectable, Logger } from '@nestjs/common';
import { SongImporter } from './song-importer.interface';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../../../data-store/entities/game.entity';
import { Repository } from 'typeorm';
import { SongService } from '../song.service';

@Injectable()
export class AudioTripSongImporterService implements SongImporter {
  private atcdGoogleSheetCsvUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSkLrlwY9o4Rx0mfkhanArNRbuRvX5acyV_DuhFTo86p-dl-dgrZfqKSn6ob-S2HIC0AhiD-pi4ItbR/pub?output=csv&gid=0';

  gameName = 'audio_trip';

  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private songService: SongService,
  ) {}
  importSongs(): Promise<number> {
    return new Promise<number>(async (resolve) => {
      const game = await this.gameRepository.findOneBy({ name: this.gameName });
      this.httpService
        .get(this.atcdGoogleSheetCsvUrl)
        .subscribe(async (response) => {
          const neatCsv = await import('neat-csv');
          const parsedSheet = await neatCsv.default(response.data, {
            skipLines: 3,
          });

          let lineSkipped = false;
          for (const row of parsedSheet) {
            if (!lineSkipped) {
              lineSkipped = true;
            } else {
              try {
                await this.songService.saveSong(
                  this.songService.createSongEntity(
                    game,
                    row.Title,
                    row.Artists,
                    row.Mapper,
                    undefined,
                    row['GET ALL'],
                    parseInt(row.BPM) > 0 ? parseInt(row.BPM) : undefined,
                    undefined, // FIXME: Need to convert this from time format to seconds.
                  ),
                );
              } catch (err) {
                this.logger.warn('Import of audio trip song failed', {
                  err: err,
                  row: row,
                });
              }
            }
          }
          resolve(parsedSheet.length);
        });
    });
  }
}
