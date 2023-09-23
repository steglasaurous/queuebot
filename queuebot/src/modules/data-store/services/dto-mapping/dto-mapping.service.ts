import { Injectable } from '@nestjs/common';
import { SongRequest } from '../../entities/song-request.entity';
import { SongRequestDto } from '../../dto/song-request.dto';
import { SongDto } from '../../dto/song.dto';

@Injectable()
export class DtoMappingService {
  public songRequestToDto(songRequest: SongRequest): SongRequestDto {
    const songDto = new SongDto();
    songDto.id = songRequest.song.id;
    songDto.title = songRequest.song.title;
    songDto.artist = songRequest.song.artist;
    songDto.songHash = songRequest.song.songHash;
    songDto.mapper = songRequest.song.mapper;
    songDto.bpm = songRequest.song.bpm;
    songDto.duration = songRequest.song.duration;
    songDto.downloadUrl = songRequest.song.downloadUrl;
    songDto.gameName = songRequest.song.game.name;

    const songRequestDto = new SongRequestDto();
    songRequestDto.id = songRequest.id;
    songRequestDto.song = songDto;
    songRequestDto.requesterName = songRequest.requesterName;
    songRequestDto.requestOrder = songRequest.requestOrder;
    songRequestDto.requestTimestamp = songRequest.requestTimestamp;

    return songRequestDto;
  }
}
