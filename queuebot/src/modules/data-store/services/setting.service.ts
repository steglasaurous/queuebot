import { Injectable } from '@nestjs/common';
import { SettingDefinition } from '../entities/setting-definition.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../entities/setting.entity';
import { Channel } from '../entities/channel.entity';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(SettingDefinition)
    private settingDefinitionRepository: Repository<SettingDefinition>,
    @InjectRepository(Setting) private settingRepository: Repository<Setting>,
  ) {}
  async getSettingDefinition(
    settingDefinitionName: string,
  ): Promise<SettingDefinition | undefined> {
    return await this.settingDefinitionRepository.findOneBy({
      name: settingDefinitionName,
    });
  }

  async setValue(
    channel: Channel,
    settingDefinition: SettingDefinition,
    value: string,
  ): Promise<void> {
    let settingValue = await this.settingRepository.findOneBy({
      channel: channel,
      settingName: settingDefinition,
    });
    if (!settingValue) {
      settingValue = new Setting();
      settingValue.settingName = settingDefinition;
      settingValue.channel = channel;
    }

    settingValue.value = value;
    await this.settingRepository.save(settingValue);
  }
}
