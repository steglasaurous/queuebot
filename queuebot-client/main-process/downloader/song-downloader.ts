import { DownloadHandler } from './handlers/download-handler.interface';
import { SongDto } from '../../../common';

export class SongDownloader {
  constructor(private downloadHandlers: DownloadHandler[]) {}

  async processSong(song: SongDto) {
    for (const downloadHandler of this.downloadHandlers) {
      if (downloadHandler.songSupported(song)) {
        if (downloadHandler.songIsLocal(song)) {
          // Song is already present, no need to download it.
          console.log('Song is already local, moving on.');
          return;
        }
        console.log('Downloading song');
        await downloadHandler.downloadSong(song);
      }
    }
  }
}
