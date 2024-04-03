import { SongDto } from '../../../../common';

export interface DownloadHandler {
  songIsLocal(song: SongDto): boolean;
  downloadSong(song: SongDto, songStateCallback: any): Promise<void>;
  songSupported(song: SongDto): boolean;
}
