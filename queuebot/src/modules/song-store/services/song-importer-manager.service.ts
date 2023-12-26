import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { SongImporter } from './song-importers/song-importer.interface';
import { Cron } from '@nestjs/schedule';
import { SONG_IMPORTERS } from '../injection-tokens';
import { Worker, isMainThread } from 'worker_threads';

@Injectable()
export class SongImporterManagerService implements OnApplicationBootstrap {
  private logger: Logger = new Logger(SongImporterManagerService.name);
  constructor(@Inject(SONG_IMPORTERS) private songImporters: SongImporter[]) {}

  async runImporters() {
    for (const importer of this.songImporters) {
      this.logger.log('Executing song importer', {
        importerName: importer.constructor.name,
      });
      const songsImported = await importer.importSongs();
      this.logger.log('Song importer done', {
        importer: importer.constructor.name,
        songsImported: songsImported,
      });
    }
  }

  @Cron('0 0 * * * *')
  private cron() {
    if (isMainThread) {
      this.logger.log('Cron: Executing song importers');
      this.startImportWorker();
    }
  }

  // FIXME: Add handling to not trigger this all the time in dev
  //        so we're not hammering APIs for no good reason.
  onApplicationBootstrap(): any {
    if (isMainThread) {
      this.logger.log('Bootstrap: Executing song importers');
      this.startImportWorker();
    }
  }

  private startImportWorker() {
    const worker = new Worker(require.main.filename);
    worker.on('exit', () => {
      this.logger.log('Worker exited');
    });
  }
}
