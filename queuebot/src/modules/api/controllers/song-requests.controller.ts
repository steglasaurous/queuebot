import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { Repository } from 'typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DtoMappingService } from '../../data-store/services/dto-mapping.service';
import { SongRequestDto } from '../../../../../common';

@Controller('api/channels/:channelName/song-requests')
export class SongRequestsController {
  constructor(
    private songRequestService: SongRequestService,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    private dtoMappingService: DtoMappingService,
  ) {}
  @Post()
  create(@Param('channelName') channelName: string) {}

  @Get()
  async getSongRequestQueue(
    @Param('channelName') channelName: string,
    @Query('nextsong') getNextSong: boolean,
  ): Promise<SongRequestDto[]> {
    const channel = await this.channelRepository.findOneBy({
      channelName: channelName,
    });

    if (!channel) {
      throw new BadRequestException('ChannelName does not exist');
    }

    // If nextsong is true, trigger the next song handling before returning results.
    if (getNextSong) {
      await this.songRequestService.getNextRequest(channel);
    }

    const songRequests = await this.songRequestService.getAllRequests(channel);

    return songRequests.map((songRequest) => {
      return this.dtoMappingService.songRequestToDto(songRequest);
    });
  }

  @Put('/{songRequestId}/swapOrder')
  async swapOrder(
    @Param('channelName') channelName: string,
    @Param('songRequestId') songRequestId: number,
  ) {
    // FIXME: Implement this
    // How to get params in a PUT?
    // Put a guard on this to ensure the user has access to make this change
  }
}
