import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from './channel.entity';
import { SettingDefinition } from './setting-definition.entity';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Channel, (channel) => channel.requests, {
    eager: true,
    nullable: false,
  })
  channel: Channel;

  @ManyToOne(() => SettingDefinition, { eager: true, nullable: false })
  settingName: SettingDefinition;

  @Column()
  value: string;
}
