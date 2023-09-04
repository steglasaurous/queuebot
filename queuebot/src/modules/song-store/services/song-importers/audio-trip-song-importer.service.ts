import { Injectable } from '@nestjs/common';
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
            skipLines: 1,
          });

          let lineSkipped = false;
          parsedSheet.forEach((row) => {
            if (!lineSkipped) {
              lineSkipped = true;
            } else {
              this.songService.saveSong(
                game,
                row.Title,
                row.Artists,
                row.Mapper,
              );
            }
          });
          resolve(parsedSheet.length);
        });
    });
  }
}
