import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ChannelDto } from '../../../../../common';
import { DtoMappingService } from '../../data-store/services/dto-mapping.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ChannelDto as ChannelDtoClass } from '../dto/channel.dto';

@Controller('api/channels/:channelName')
export class ChannelController {
  constructor(
    private dtoMappingService: DtoMappingService,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
  ) {}

  @ApiOperation({
    description: 'Get general details about the given channel',
    tags: ['Channel'],
  })
  @ApiOkResponse({
    type: ChannelDtoClass,
  })
  @Get()
  async getChannelDetails(
    @Param('channelName') channelName: string,
  ): Promise<ChannelDto> {
    const channel = await this.channelRepository.findOneBy({
      channelName: channelName,
    });

    if (!channel) {
      throw new BadRequestException('ChannelName does not exist');
    }

    return this.dtoMappingService.channelToDto(channel);
  }
}
