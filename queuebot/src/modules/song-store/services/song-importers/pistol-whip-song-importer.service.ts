import { Inject, Injectable, Logger } from '@nestjs/common';
import { MOD_IO_API_KEY, MOD_IO_BASE_URL } from '../../injection-tokens';
import { HttpService } from '@nestjs/axios';
import { SongImporter } from './song-importer.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../../../data-store/entities/game.entity';
import { Repository } from 'typeorm';
import { SongService } from '../song.service';
import * as fs from 'fs';
import { tmpdir } from 'os';
import * as yauzl from 'yauzl';

import { join } from 'path';

import * as streams from 'memory-streams';
import { ModIoApiService } from '../mod-io-api.service';

@Injectable()
export class PistolWhipSongImporterService implements SongImporter {
  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    @Inject(MOD_IO_BASE_URL) private modIoBaseUrl: string,
    @Inject(MOD_IO_API_KEY) private modIoApiKey: string,
    private httpService: HttpService,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private songService: SongService,
    private modIoApiService: ModIoApiService,
  ) {}

  gameName = 'pistol_whip';
  // FIXME: CONTINUE HERE -
  // - Implement a mod.io service that handles:
  //   - Paginated resultss
  //   - Manage rate limits when limit is hit, especially around downloads
  // - Handle cases of shit data (some songs have no title or artist?)

  importSongs(): Promise<number> {
    return new Promise<number>(async (resolve) => {
      const game = await this.gameRepository.findOneBy({ name: this.gameName });
      let songCount = 0;

      const data = await this.modIoApiService.getModsForGame(4407);
      for (const dataPage of data) {
        for (const dataItem of dataPage.data) {
          const existingSong = await this.songService.getSongBySongHash(
            game,
            dataItem.id,
          );
          if (!existingSong) {
            await this.downloadAndImportSong(
              game,
              dataItem.id,
              dataItem.modfile.download.binary_url,
              dataItem.name,
              dataItem.submitted_by.username,
            );
            songCount++;
          }
        }
      }
      resolve(songCount);
    });
  }

  private downloadAndImportSong(
    game: Game,
    modId: number,
    downloadUrl: string,
    modName: string,
    modSubmitter: string,
  ): Promise<void> {
    return new Promise(async (resolve) => {
      this.logger.log('Downloading ' + downloadUrl);

      // Create a work dir to do our stuff
      const workDir = fs.mkdtempSync(join(tmpdir(), 'queuebot-'));
      const zipPath = join(workDir, 'download.zip');
      await this.modIoApiService.downloadModFile(downloadUrl, zipPath);

      // Unzip file - just need the level.pw file inside
      this.logger.log('Processing zip');
      yauzl.open(zipPath, { lazyEntries: true }, (err, zipFile) => {
        if (err) throw err;
        zipFile.readEntry();
        zipFile.on('end', () => {});
        zipFile.on('entry', (entry) => {
          if (entry.fileName == 'level.pw') {
            // Read this into memory as it's small enough
            zipFile.openReadStream(entry, (err, readStream) => {
              if (err) throw err;
              readStream.on('end', async () => {
                const levelData = JSON.parse(levelDataStream.toString());
                await this.songService.saveSong(
                  this.songService.createSongEntity(
                    game,
                    modName,
                    levelData.songArtist,
                    // Using the submitter username from mod.io - the song data itself does not seem to
                    // be reliable for this
                    modSubmitter,
                    modId.toString(),
                    downloadUrl,
                    parseInt(levelData.tempo),
                    parseInt(levelData.songLength),
                    levelData.maps[0],
                  ),
                );
                zipFile.close();
                // Remove the zip since we're done with it.
                fs.unlinkSync(zipPath);

                resolve();
              });

              const levelDataStream = new streams.WritableStream();

              readStream.pipe(levelDataStream);
            });
          } else {
            zipFile.readEntry();
          }
        });
      });
    });
  }
}
