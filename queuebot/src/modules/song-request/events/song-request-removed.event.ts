import {SongRequest} from "../../data-store/entities/song-request.entity";

export class SongRequestRemovedEvent {
  songRequest: SongRequest;
}
