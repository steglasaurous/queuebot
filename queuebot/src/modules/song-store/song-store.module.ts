import { Module } from '@nestjs/common';
import { SongService } from './services/song.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataStoreModule } from '../data-store/data-store.module';
import { AudioTripSongImporterService } from './services/song-importers/audio-trip-song-importer.service';
import { HttpModule } from '@nestjs/axios';
import { SongImporterManagerService } from './services/song-importer-manager.service';

export const SONG_IMPORTERS = 'SONG_IMPORTERS';

@Module({
  imports: [TypeOrmModule.forFeature(), DataStoreModule, HttpModule],
  providers: [
    SongService,
    AudioTripSongImporterService,
    {
      provide: SONG_IMPORTERS,
      inject: [AudioTripSongImporterService],
      useFactory: (audioTrip: AudioTripSongImporterService) => {
        return [audioTrip];
      },
    },
    SongImporterManagerService,
  ],
})
export class SongStoreModule {}
