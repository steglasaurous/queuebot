import { SongDto } from '../../../../common';
import { DownloadHandler } from './download-handler.interface';
import * as fs from 'fs';
import * as path from 'path';
import axios, { AxiosProgressEvent, AxiosResponse } from 'axios';
import { join } from 'path';
import { tmpdir } from 'os';
import decompress from 'decompress';

export class SpinRhythmDownloadHandler implements DownloadHandler {
  constructor(private songsDir: string) {}
  songIsLocal(song: SongDto): boolean {
    const filepath = path.join(this.songsDir, song.fileReference + '.srtb');
    return fs.existsSync(filepath);
  }
  async downloadSong(song: SongDto): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const workDir = fs.mkdtempSync(join(tmpdir(), 'queuebot-'));
      const zipFilename = path.join(workDir, 'download.zip');
      const writer = fs.createWriteStream(zipFilename);

      axios({
        method: 'get',
        url: song.downloadUrl,
        responseType: 'stream',
        onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
          console.log(progressEvent);
        },
      })
        .then((response: AxiosResponse<any, any>) => {
          response.data.pipe(writer);
          writer.on('finish', () => {
            console.log('writer finished');
            // FIXME: Continue here: Extract the zip to the destination, then remove the zip.
            // NOTE: The IDE says this is an error, but the compiler does not.  Ignore the IDE in this case.
            // @ts-ignore
            decompress(zipFilename, this.songsDir).then(() => {
              console.log('Decompressing done');
              resolve(true);
            });
          });
        })
        .catch((e) => {
          console.log(`Failed to download ${song.downloadUrl}`, e);
          reject(e);
        });
    });
  }

  songSupported(song: SongDto): boolean {
    return song.gameName == 'spin_rhythm';
  }
}
