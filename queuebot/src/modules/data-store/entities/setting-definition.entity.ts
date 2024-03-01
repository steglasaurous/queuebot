import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
/**
 * A generic setting mechanism - this defines the possible settings available for a channel
 */
export class SettingDefinition {
  @PrimaryColumn()
  name: string;

  @Column({ nullable: true })
  defaultValue?: string;

  // If this setting only has specific values it can be set to, this should set it.
  @Column({ type: 'simple-array', nullable: true })
  choices: string[];
}
