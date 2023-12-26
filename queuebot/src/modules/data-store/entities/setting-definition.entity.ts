import { Column, Entity, PrimaryColumn } from 'typeorm';
import { SettingDataType } from '../models/setting-data-type.enum';

@Entity()
export class SettingDefinition {
  @PrimaryColumn()
  name: string;

  @Column()
  dataType: SettingDataType;

  @Column({ nullable: true })
  choices?: string[];

  @Column({ nullable: true })
  defaultValue?: string;
}
