import { SongDto } from './song.dto';

export interface SongRequestDto {
  id: number;
  song: SongDto;
  requesterName: string;
  requestTimestamp: number;
  requestOrder: number;
}
