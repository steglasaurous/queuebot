import { Module } from '@nestjs/common';
import { SongService } from './services/song.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataStoreModule } from '../data-store/data-store.module';
import { AudioTripSongImporterService } from './services/song-importers/audio-trip-song-importer.service';
import { HttpModule } from '@nestjs/axios';
import { SongImporterManagerService } from './services/song-importer-manager.service';
import { LocalStrategy } from './services/song-search-strategies/local.strategy';
import { SpinRhythmSearchStrategy } from './services/song-search-strategies/spin-rhythm-search.strategy';
import { SONG_IMPORTERS, SONG_SEARCH_STRATEGIES } from './injection-tokens';
import { SpinRhythmSongImporterService } from './services/song-importers/spin-rhythm-song-importer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(),
    DataStoreModule,
    HttpModule.register({}),
  ],
  providers: [
    SongService,
    AudioTripSongImporterService,
    SpinRhythmSongImporterService,
    {
      provide: SONG_IMPORTERS,
      inject: [AudioTripSongImporterService, SpinRhythmSongImporterService],
      useFactory: (
        audioTrip: AudioTripSongImporterService,
        spin: SpinRhythmSongImporterService,
      ) => {
        return [audioTrip, spin];
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
        // Add back spinRhythmStrategy to this array to query the spinsha.re API directly.
        return [localStrategy];
      },
    },
    SongImporterManagerService,
  ],
  exports: [SongService],
})
export class SongStoreModule {}
