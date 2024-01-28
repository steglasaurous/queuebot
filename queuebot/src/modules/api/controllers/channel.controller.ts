import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ChannelDto } from '../../../../../common';
import { DtoMappingService } from '../../data-store/services/dto-mapping.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';

@Controller('api/channels/:channelName')
export class ChannelController {
  constructor(
    private dtoMappingService: DtoMappingService,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
  ) {}

  // FIXME: Decision: Just make this public for anyone?  Or limit it to authorized users?
  // So far nothing here is really private or otherwise unknown information.
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
