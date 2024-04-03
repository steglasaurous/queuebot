import { SongDto } from '../../../../common';
import { DownloadHandler } from './download-handler.interface';
import * as fs from 'fs';
import * as path from 'path';
import axios, { AxiosProgressEvent, AxiosResponse } from 'axios';
import { join } from 'path';
import { tmpdir } from 'os';
import decompress from 'decompress';
import { DownloadState, LocalSongState } from '../../local-song-state';

export class SpinRhythmDownloadHandler implements DownloadHandler {
  constructor(private songsDir: string) {}
  songIsLocal(song: SongDto): boolean {
    const filepath = path.join(this.songsDir, song.fileReference + '.srtb');
    return fs.existsSync(filepath);
  }
  async downloadSong(song: SongDto, songStateCallback: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const songState: LocalSongState = {
        songId: song.id,
        downloadState: DownloadState.Waiting,
        downloadProgress: 0,
      };
      if (!song.downloadUrl) {
        console.log('Song does not have a downloadUrl', {
          songId: song.id,
          title: song.title,
        });
        // Nothing to download.
        songState.downloadState = DownloadState.Complete;
        songStateCallback(songState);
        resolve();
        return;
      }

      const workDir = fs.mkdtempSync(join(tmpdir(), 'queuebot-'));
      const zipFilename = path.join(workDir, 'download.zip');
      const writer = fs.createWriteStream(zipFilename);
      console.log('Downloading song', { songId: song.id, title: song.title });
      axios({
        method: 'get',
        url: song.downloadUrl,
        responseType: 'stream',
        onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
          songState.downloadState = DownloadState.InProgress;
          songState.downloadProgress = progressEvent.progress;
          songStateCallback(songState);
        },
      })
        .then((response: AxiosResponse<any, any>) => {
          response.data.pipe(writer);
          writer.on('finish', () => {
            // NOTE: The IDE says this is an error, but the compiler does not.  Ignore the IDE in this case.
            // @ts-ignore
            decompress(zipFilename, this.songsDir).then(() => {
              console.log('Decompressing done');
              songState.downloadState = DownloadState.Complete;
              songStateCallback(songState);
              resolve();
            });
          });
        })
        .catch((e) => {
          console.log(`Failed to download ${song.downloadUrl}`, {
            error: e,
            songId: song.id,
            title: song.title,
          });
          songState.downloadState = DownloadState.Failed;
          songStateCallback(songState);
          reject(e);
        });
    });
  }

  songSupported(song: SongDto): boolean {
    return song.gameName == 'spin_rhythm';
  }
}
