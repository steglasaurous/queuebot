import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChannelDto } from '../../../../../common';
import { DtoMappingService } from '../../data-store/services/dto-mapping.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { ApiCookieAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ChannelDto as ChannelDtoClass } from '../dto/channel.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { I18nService } from 'nestjs-i18n';
import { ChatManagerService } from '../../chat/services/chat-manager.service';
import { Game } from '../../data-store/entities/game.entity';

@Controller('api/channels/:channelName')
export class ChannelController {
  constructor(
    private dtoMappingService: DtoMappingService,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private i18n: I18nService,
    private chatManager: ChatManagerService,
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

  @ApiCookieAuth('jwt')
  @ApiOperation({
    description:
      'Modify a channel.  Note only enabled, queueOpen and game are modifiable, all others are read-only.',
    tags: ['Channel'],
  })
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateChannelDetails(
    @Param('channelName') channelName: string,
    @Body() channelDto: ChannelDto,
    @Req() request: Request,
  ): Promise<ChannelDto> {
    // enabled, queueOpen, game should be modifiable.  All others are not.
    // Only broadcasters or mods can modify.
    const channel = await this.channelRepository.findOneBy({
      channelName: channelName,
    });
    if (!channel) {
      throw new BadRequestException('Channel does not exist');
    }

    if (channel.channelName != request['user'].username) {
      throw new BadRequestException(
        'Only broadcasters can modify their channels',
      );
    }
    const chatMessageToEmit = [];

    if (
      channelDto.enabled != undefined &&
      channelDto.enabled != channel.enabled
    ) {
      channel.enabled = channelDto.enabled;
      if (channel.enabled) {
        chatMessageToEmit.push(
          this.i18n.t('chat.BotIsOn', { lang: channel.lang }),
        );
      } else {
        chatMessageToEmit.push(
          this.i18n.t('chat.BotIsOff', { lang: channel.lang }),
        );
      }
    }

    if (
      channelDto.queueOpen != undefined &&
      channelDto.queueOpen != channel.queueOpen
    ) {
      channel.queueOpen = channelDto.queueOpen;
      if (channel.queueOpen) {
        chatMessageToEmit.push(
          this.i18n.t('chat.QueueOpen', { lang: channel.lang }),
        );
      } else {
        chatMessageToEmit.push(
          this.i18n.t('chat.QueueClosed', { lang: channel.lang }),
        );
      }
      // Emit the appropriate message to chat.
    }
    if (channelDto.game != undefined && channelDto.game.id != undefined) {
      // Validate the game setting
      const game = await this.gameRepository.findOneBy({
        id: channelDto.game.id,
      });
      if (!game) {
        throw new BadRequestException('Game id provided is invalid');
      }

      channel.game = game;
    }

    await this.channelRepository.save(channel);

    if (chatMessageToEmit.length > 0) {
      for (const chatMessageToEmitElement of chatMessageToEmit) {
        await this.chatManager.sendMessage(
          channel.channelName,
          chatMessageToEmitElement,
        );
      }
    }

    return this.dtoMappingService.channelToDto(channel);
  }
}
