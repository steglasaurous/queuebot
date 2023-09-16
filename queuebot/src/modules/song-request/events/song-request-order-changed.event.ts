import {SongRequest} from "../../data-store/entities/song-request.entity";

export class SongRequestOrderChangedEvent {
  songRequest: SongRequest;
}
