import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { SongImporter } from './song-importers/song-importer.interface';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SongImporterManagerService implements OnApplicationBootstrap {
  private logger: Logger = new Logger(SongImporterManagerService.name);
  constructor(
    @Inject('SONG_IMPORTERS') private songImporters: SongImporter[],
  ) {}

  async runImporters() {
    this.songImporters.forEach(async (importer) => {
      this.logger.log('Song importer done', {
        importer: importer.constructor.name,
        songsImported: await importer.importSongs(),
      });
    });
  }

  @Cron('0 0 * * * *')
  private cron() {
    this.logger.log('Cron: Executing song importers');
    this.runImporters();
  }

  onApplicationBootstrap(): any {
    this.logger.log('Bootstrap: Running importers');
    this.runImporters();
  }
}
