import { config } from 'dotenv';
config();

import { DataSourceOptions } from 'typeorm';
import { Channel } from './modules/data-store/entities/channel.entity';

import { Game } from './modules/data-store/entities/game.entity';
import { Song } from './modules/data-store/entities/song.entity';
import { SongRequest } from './modules/data-store/entities/song-request.entity';

import { UserBotState } from './modules/data-store/entities/user-bot-state.entity';
import { User } from './modules/data-store/entities/user.entity';
import { UserAuthSource } from './modules/data-store/entities/user-auth-source.entity';
import { Migration1703537138064 } from '../migrations/1703537138064-migration';
import { Migration1703552537118 } from '../migrations/1703552537118-migration';

export const typeORMAppConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    Channel,
    Game,
    Song,
    SongRequest,
    UserBotState,
    User,
    UserAuthSource,
  ],
  migrations: [Migration1703537138064, Migration1703552537118],
};
