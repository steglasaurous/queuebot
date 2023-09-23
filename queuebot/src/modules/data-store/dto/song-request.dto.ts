import { SongDto } from './song.dto';

export class SongRequestDto {
  id: number;
  song: SongDto;
  requesterName: string;
  requestTimestamp: number;
  requestOrder: number;
}
