import { SongDto } from '../../../../common';

export interface DownloadHandler {
  songIsLocal(song: SongDto): boolean;
  downloadSong(song: SongDto): boolean;
}
