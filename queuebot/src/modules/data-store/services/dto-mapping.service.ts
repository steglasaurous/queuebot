import { Injectable } from '@nestjs/common';
import { SongRequest } from '../entities/song-request.entity';
import { Channel } from '../entities/channel.entity';
import {
  SongRequestDto,
  SongDto,
  ChannelDto,
  GameDto,
} from '../../../../../common';
import { Game } from '../entities/game.entity';

@Injectable()
export class DtoMappingService {
  public songRequestToDto(songRequest: SongRequest): SongRequestDto {
    const songDto: SongDto = {
      id: songRequest.song.id,
      title: songRequest.song.title,
      artist: songRequest.song.artist,
      songHash: songRequest.song.songHash,
      mapper: songRequest.song.mapper,
      bpm: songRequest.song.bpm,
      duration: songRequest.song.duration,
      downloadUrl: songRequest.song.downloadUrl,
      fileReference: songRequest.song.fileReference,
      gameName: songRequest.song.game.name,
    };

    return {
      id: songRequest.id,
      song: songDto,
      requesterName: songRequest.requesterName,
      requestOrder: songRequest.requestOrder,
      requestTimestamp: songRequest.requestTimestamp.valueOf(),
      isActive: songRequest.isActive,
      isDone: songRequest.isDone,
    } as SongRequestDto;
  }

  public channelToDto(channel: Channel): ChannelDto {
    const gameDto: GameDto = this.gameToDto(channel.game);

    return {
      game: gameDto,
      channelName: channel.channelName,
      inChannel: channel.inChannel,
      enabled: channel.enabled,
      queueOpen: channel.queueOpen,
    } as ChannelDto;
  }

  public gameToDto(game: Game): GameDto {
    return {
      id: game.id,
      name: game.name,
      displayName: game.displayName,
      setGameName: game.setGameName,
      twitchCategoryId: game.twitchCategoryId,
    };
  }
}
