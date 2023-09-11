import { Module } from '@nestjs/common';
import { SongService } from './services/song.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataStoreModule } from '../data-store/data-store.module';
import { AudioTripSongImporterService } from './services/song-importers/audio-trip-song-importer.service';
import { HttpModule } from '@nestjs/axios';
import { SongImporterManagerService } from './services/song-importer-manager.service';
import { LocalStrategy } from './services/song-search-strategies/local.strategy';
import { SpinRhythmSearchStrategy } from './services/song-search-strategies/spin-rhythm-search.strategy';

export const SONG_IMPORTERS = 'SONG_IMPORTERS';
export const SONG_SEARCH_STRATEGIES = 'SONG_SEARCH_STRATEGIES';
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
    LocalStrategy,
    SpinRhythmSearchStrategy,
    {
      provide: SONG_SEARCH_STRATEGIES,
      inject: [LocalStrategy, SpinRhythmSearchStrategy],
      useFactory: (
        localStrategy: LocalStrategy,
        spinRhythmStrategy: SpinRhythmSearchStrategy,
      ) => {
        return [localStrategy, spinRhythmStrategy];
      },
    },
    SongImporterManagerService,
  ],
  exports: [SongService],
})
export class SongStoreModule {}
