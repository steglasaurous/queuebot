import { Injectable } from '@nestjs/common';
import { SongRequest } from '../entities/song-request.entity';
import { SongRequestDto } from '../dto/song-request.dto';
import { SongDto } from '../dto/song.dto';
import { Channel } from '../entities/channel.entity';
import { GameDto } from '../dto/game.dto';
import { ChannelDto } from '../dto/channel.dto';

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
    songDto.fileReference = songRequest.song.fileReference;
    songDto.gameName = songRequest.song.game.name;

    const songRequestDto = new SongRequestDto();
    songRequestDto.id = songRequest.id;
    songRequestDto.song = songDto;
    songRequestDto.requesterName = songRequest.requesterName;
    songRequestDto.requestOrder = songRequest.requestOrder;
    songRequestDto.requestTimestamp = songRequest.requestTimestamp.valueOf();
    songRequestDto.isActive = songRequest.isActive;
    songRequestDto.isDone = songRequest.isDone;

    return songRequestDto;
  }

  public channelToDto(channel: Channel): ChannelDto {
    const gameDto = new GameDto();
    gameDto.id = channel.game.id;
    gameDto.name = channel.game.name;
    gameDto.displayName = channel.game.displayName;
    gameDto.setGameName = channel.game.setGameName;
    gameDto.twitchCategoryId = channel.game.twitchCategoryId;

    const channelDto = new ChannelDto();
    channelDto.game = gameDto;
    channelDto.channelName = channel.channelName;
    channelDto.inChannel = channel.inChannel;
    channelDto.enabled = channel.enabled;
    channelDto.queueOpen = channel.queueOpen;

    return channelDto;
  }
}
