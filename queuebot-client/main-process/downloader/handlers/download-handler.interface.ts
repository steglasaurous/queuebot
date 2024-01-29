import { SongDto } from '../../../../common';

export interface DownloadHandler {
  songIsLocal(song: SongDto): boolean;
  downloadSong(song: SongDto): Promise<boolean>;
  songSupported(song: SongDto): boolean;
}
