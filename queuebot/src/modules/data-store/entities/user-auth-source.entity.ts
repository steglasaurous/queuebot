import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

export enum AuthSource {
  STEAM = 'steam',
}

@Entity()
@Unique(['user', 'authSource'])
export class UserAuthSource {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userAuthSources, { eager: true })
  user: User;

  @Column({ type: 'varchar' })
  authSource: AuthSource;

  @Column()
  authSourceUserId: string;

  @Column({ type: 'simple-json', nullable: true })
  authSourceProfileData: object;
}
