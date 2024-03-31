import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { Repository } from 'typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DtoMappingService } from '../../data-store/services/dto-mapping.service';
import { SongRequestDto } from '../../../../../common';
import { SwapOrderDto } from '../dto/swap-order.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiBody,
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SongRequestDto as SongRequestDtoClass } from '../dto/song-request.dto';
import { ChatManagerService } from '../../chat/services/chat-manager.service';
import { I18nService } from 'nestjs-i18n';

@Controller('api/channels/:channelName/song-requests')
export class SongRequestsController {
  constructor(
    private songRequestService: SongRequestService,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    private dtoMappingService: DtoMappingService,
    private chatManager: ChatManagerService,
    private i18n: I18nService,
  ) {}

  @ApiOperation({
    description:
      'Retrieves the request queue for the given channel, optionally moving the queue forward if nextsong is defined',
    tags: ['Request Queue'],
  })
  @ApiParam({
    name: 'channelName',
    description: 'The twitch channel name (i.e. twitch username)',
  })
  @ApiQuery({
    name: 'nextsong',
    description:
      'If set to true, advances the song queue ahead as if !nextsong was used',
  })
  @ApiOkResponse({ type: [SongRequestDtoClass] })
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

  @ApiCookieAuth('jwt')
  @ApiBody({ type: SwapOrderDto })
  @ApiOperation({
    description:
      'Swap requestOrder between the songRequestId in the URL with the songRequestId in the body',
    tags: ['Request Queue'],
  })
  @ApiOkResponse({ type: 'boolean' })
  @UseGuards(JwtAuthGuard)
  @Put('/:songRequestId/swapOrder')
  async swapOrder(
    @Param('channelName') channelName: string,
    @Param('songRequestId') songRequestId: number,
    @Body() swapOrderDto: SwapOrderDto,
    @Req() request: Request,
  ) {
    if (!request['user']) {
      throw new UnauthorizedException('Login required.');
    }
    // Confirm this user owns the channel this belongs to.
    if (request['user'].username != channelName) {
      throw new UnauthorizedException('You are not the owner of this channel.');
    }
    await this.songRequestService.swapOrder(
      songRequestId,
      swapOrderDto.songRequestId,
    );

    return true;
  }

  @ApiCookieAuth('jwt')
  @ApiOperation({
    description:
      'Advances the queue by setting the currently active song to done (if available) and marking the next song as active',
    tags: ['Request Queue'],
  })
  @ApiOkResponse({ type: 'boolean' })
  @UseGuards(JwtAuthGuard)
  @Put('next-song')
  async nextSong(
    @Param('channelName') channelName: string,
    @Req() request: Request,
  ) {
    if (!request['user']) {
      throw new UnauthorizedException('Login required.');
    }

    if (request['user'].username != channelName) {
      throw new UnauthorizedException('You are not the owner of this channel.');
    }
    const channel = await this.channelRepository.findOneBy({
      channelName: channelName,
    });
    const nextRequest = await this.songRequestService.getNextRequest(channel);
    if (nextRequest) {
      await this.chatManager.sendMessage(
        channelName,
        this.i18n.t('chat.NextRequest', {
          lang: channel.lang,
          args: {
            title: nextRequest.song.title,
            artist: nextRequest.song.artist,
            mapper: nextRequest.song.mapper,
            requesterName: nextRequest.requesterName,
          },
        }),
      );

      return this.dtoMappingService.songRequestToDto(nextRequest);
    }

    return;
  }

  @ApiCookieAuth('jwt')
  @ApiOperation({
    description:
      'Remove a song request.  Must either be a broadcaster or mod of the channel it belongs to, or be the original requester of this request.',
    tags: ['Request Queue'],
  })
  @ApiNoContentResponse()
  @UseGuards(JwtAuthGuard)
  @Delete(`/:songRequestId`)
  async deleteSongRequest(
    @Param('channelName') channelName: string,
    @Param('songRequestId') songRequestId: number,
    @Req() request: Request,
  ) {
    if (!request['user']) {
      throw new UnauthorizedException('Login required.');
    }
    const songRequest =
      await this.songRequestService.getRequestById(songRequestId);
    if (!songRequest) {
      throw new BadRequestException('Song request does not exist');
    }

    if (
      request['user'].username != songRequest.channel.channelName &&
      request['user'].username != songRequest.requesterName
    ) {
      throw new UnauthorizedException(
        'User is not the broadcaster nor the original requester of this request.',
      );
    }

    // IF we made it here, we're good to go.
    await this.songRequestService.removeRequest(songRequest);
  }
}
