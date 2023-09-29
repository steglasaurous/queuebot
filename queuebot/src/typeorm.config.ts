import { DataSource } from 'typeorm';
import { Channel } from './modules/data-store/entities/channel.entity';

import { Game } from './modules/data-store/entities/game.entity';
import { Song } from './modules/data-store/entities/song.entity';
import { SongRequest } from './modules/data-store/entities/song-request.entity';

import { UserBotState } from './modules/data-store/entities/user-bot-state.entity';
import { Migration1694269783271 } from '../migrations/1694269783271-migration';
import { Migration1694269850585 } from '../migrations/1694269850585-migration';
import { Migration1694279063189 } from '../migrations/1694279063189-migration';
import { Migration1694283902832 } from '../migrations/1694283902832-migration';
import { Migration1694473306655 } from '../migrations/1694473306655-migration';
import { Migration1694525381985 } from '../migrations/1694525381985-migration';
import { Migration1694645009778 } from '../migrations/1694645009778-migration';
import { Migration1694962940864 } from '../migrations/1694962940864-migration';
import { Migration1695472504194 } from '../migrations/1695472504194-migration';
import { Migration1695489436659 } from '../migrations/1695489436659-migration';
import { User } from './modules/data-store/entities/user.entity';
import { UserAuthSource } from './modules/data-store/entities/user-auth-source.entity';
import { Migration1696022219356 } from '../migrations/1696022219356-migration';

export default new DataSource({
  type: 'sqlite',
  database: 'database/queuebot.db',
  entities: [
    Channel,
    Game,
    Song,
    SongRequest,
    UserBotState,
    User,
    UserAuthSource,
  ],
  migrations: [
    Migration1694269783271,
    Migration1694269850585,
    Migration1694279063189,
    Migration1694283902832,
    Migration1694473306655,
    Migration1694525381985,
    Migration1694645009778,
    Migration1694962940864,
    Migration1695472504194,
    Migration1695489436659,
    Migration1696022219356,
  ],
});
