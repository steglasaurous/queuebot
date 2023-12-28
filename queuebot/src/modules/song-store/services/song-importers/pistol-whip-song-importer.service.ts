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

@Injectable()
export class PistolWhipSongImporterService implements SongImporter {
  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    @Inject(MOD_IO_BASE_URL) private modIoBaseUrl: string,
    @Inject(MOD_IO_API_KEY) private modIoApiKey: string,
    private httpService: HttpService,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private songService: SongService,
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
      // FIXME: mod.io paginates its resultsets, so need to add handling for pages.
      let songCount = 0;
      this.logger.log(
        `${this.modIoBaseUrl}/games/4407/mods?api_key=${this.modIoApiKey}`,
      );

      this.httpService
        .get(`${this.modIoBaseUrl}/games/4407/mods?api_key=${this.modIoApiKey}`)
        .subscribe(async (response) => {
          this.logger.log('Pistol Whip Response: ', {
            status: response.status,
            statusText: response.statusText,
          });
          for (const dataItem of response.data.data) {
            console.log(dataItem);
            const existingSong = await this.songService.getSongBySongHash(
              game,
              dataItem.id,
            );
            if (!existingSong) {
              await this.downloadAndImportSong(
                game,
                dataItem.id,
                dataItem.modfile.download.binary_url,
              );
              songCount++;
            }
          }
          resolve(songCount);
        });
    });
  }

  private downloadAndImportSong(
    game: Game,
    modId: number,
    downloadUrl: string,
  ): Promise<void> {
    return new Promise(async (resolve) => {
      // Create a work dir to do our stuff
      const workDir = fs.mkdtempSync(join(tmpdir(), 'queuebot-'));
      const zipPath = join(workDir, 'download.zip');
      const writer = fs.createWriteStream(zipPath);
      const response = await this.httpService.axiosRef({
        url: downloadUrl,
        method: 'GET',
        responseType: 'stream',
      });

      response.data.pipe(writer);
      writer.on('finish', () => {
        // Unzip file - just need the level.pw file inside

        yauzl.open(zipPath, { lazyEntries: true }, (err, zipFile) => {
          if (err) throw err;
          zipFile.readEntry();
          zipFile.on('end', () => {});
          zipFile.on('entry', (entry) => {
            console.log(entry.fileName);
            if (entry.fileName == 'level.pw') {
              // Read this into memory as it's small enough
              zipFile.openReadStream(entry, (err, readStream) => {
                if (err) throw err;
                readStream.on('end', async () => {
                  const levelData = JSON.parse(levelDataStream.toString());
                  await this.songService.saveSong(
                    this.songService.createSongEntity(
                      game,
                      levelData.songDisplayName,
                      levelData.songArtist,
                      levelData.mapper,
                      modId.toString(),
                      downloadUrl,
                      parseInt(levelData.tempo),
                      parseInt(levelData.songLength),
                      levelData.maps[0],
                    ),
                  );

                  resolve();
                });

                let levelDataStream = new streams.WritableStream();

                readStream.pipe(levelDataStream);
              });
            } else {
              zipFile.readEntry();
            }
          });
        });
      });
    });
  }
}
