import { DataSource } from 'typeorm';
import { Channel } from './modules/data-store/entities/channel.entity';
import { Migration1691072991387 } from '../migrations/1691072991387-migration';
import { Game } from './modules/data-store/entities/game.entity';
import { Song } from './modules/data-store/entities/song.entity';
import { SongRequest } from './modules/data-store/entities/song-request.entity';
import { Migration1693744003581 } from '../migrations/1693744003581-migration';
import { Migration1693840436334 } from '../migrations/1693840436334-migration';
import { UserBotState } from './modules/data-store/entities/user-bot-state.entity';
import { Migration1693843419830 } from '../migrations/1693843419830-migration';
import { Migration1693860352105 } from '../migrations/1693860352105-migration';
import { Migration1693869187991 } from '../migrations/1693869187991-migration';

export default new DataSource({
  type: 'sqlite',
  database: 'queuebot.db',
  entities: [Channel, Game, Song, SongRequest, UserBotState],
  migrations: [
    Migration1691072991387,
    Migration1693744003581,
    Migration1693840436334,
    Migration1693843419830,
    Migration1693860352105,
    Migration1693869187991,
  ],
});
