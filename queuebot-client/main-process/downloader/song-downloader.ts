import { DownloadHandler } from './handlers/download-handler.interface';
import { SongDto } from '../../../common';

export class SongDownloader {
  constructor(private downloadHandlers: DownloadHandler[]) {}

  async processSong(song: SongDto) {
    for (const downloadHandler of this.downloadHandlers) {
      if (downloadHandler.songSupported(song)) {
        if (downloadHandler.songIsLocal(song)) {
          // Song is already present, no need to download it.
          console.log('Song present', { songId: song.id, title: song.title });
          return;
        }
        console.log('Downloading song', { songId: song.id, title: song.title });
        await downloadHandler.downloadSong(song);
      }
    }
  }
}
