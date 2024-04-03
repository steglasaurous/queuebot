import { DownloadHandler } from './handlers/download-handler.interface';
import { SongDto } from '../../../common';
import { DownloadState } from '../local-song-state';

export class SongDownloader {
  constructor(private downloadHandlers: DownloadHandler[]) {}

  async processSong(song: SongDto, songStateCallback: any) {
    for (const downloadHandler of this.downloadHandlers) {
      if (downloadHandler.songSupported(song)) {
        if (downloadHandler.songIsLocal(song)) {
          // Song is already present, no need to download it.
          console.log('Song present', { songId: song.id, title: song.title });
          songStateCallback({
            songId: song.id,
            downloadState: DownloadState.Complete,
          });
          return;
        }
        await downloadHandler.downloadSong(song, songStateCallback);
      }
    }
  }
}
