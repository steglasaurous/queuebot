import { SongRequestDto } from './song-request.dto';

export class QueueDto {
  channelName: string;
  gameDisplayName: string;
  songRequests: SongRequestDto[];
}
