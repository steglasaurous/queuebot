import { DataSource } from 'typeorm';
import { Channel } from './modules/data-store/entities/channel.entity';
import { Migration1691072991387 } from '../migrations/1691072991387-migration';
import { Game } from './modules/data-store/entities/game.entity';
import { Song } from './modules/data-store/entities/song.entity';
import { SongRequest } from './modules/data-store/entities/song-request.entity';
import { Migration1693744003581 } from '../migrations/1693744003581-migration';

export default new DataSource({
  type: 'sqlite',
  database: 'queuebot.db',
  entities: [Channel, Game, Song, SongRequest],
  migrations: [Migration1691072991387, Migration1693744003581],
});
