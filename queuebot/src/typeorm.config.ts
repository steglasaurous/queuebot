import { DataSource } from 'typeorm';
import { Channel } from './modules/data-store/entities/channel.entity';

import { Game } from './modules/data-store/entities/game.entity';
import { Song } from './modules/data-store/entities/song.entity';
import { SongRequest } from './modules/data-store/entities/song-request.entity';

import { UserBotState } from './modules/data-store/entities/user-bot-state.entity';
import { Migration1694269783271 } from '../migrations/1694269783271-migration';
import { Migration1694269850585 } from '../migrations/1694269850585-migration';

export default new DataSource({
  type: 'sqlite',
  database: 'queuebot.db',
  entities: [Channel, Game, Song, SongRequest, UserBotState],
  migrations: [Migration1694269783271, Migration1694269850585],
});
