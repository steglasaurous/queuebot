import { Module } from '@nestjs/common';
import { SongRequestService } from './services/song-request.service';
import { DataStoreModule } from '../data-store/data-store.module';
import { SongStoreModule } from '../song-store/song-store.module';

@Module({
  imports: [DataStoreModule, SongStoreModule],
  providers: [SongRequestService],
  exports: [SongRequestService],
})
export class SongRequestModule {}
