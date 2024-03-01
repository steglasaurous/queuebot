import { Module } from '@nestjs/common';
import { SongRequestService } from './services/song-request.service';
import { DataStoreModule } from '../data-store/data-store.module';
import { SongStoreModule } from '../song-store/song-store.module';
import { QueueStrategyService } from './services/queue-strategies/queue-strategy.service';
import { FifoQueueStrategy } from './services/queue-strategies/fifo.queue-strategy';
import { QUEUE_STRATEGIES } from './utils/di-tokens';

@Module({
  imports: [DataStoreModule, SongStoreModule],
  providers: [
    SongRequestService,
    QueueStrategyService,
    FifoQueueStrategy,
    {
      provide: QUEUE_STRATEGIES,
      inject: [FifoQueueStrategy],
      useFactory: (fifo: FifoQueueStrategy) => {
        return [fifo];
      },
    },
  ],
  exports: [SongRequestService],
})
export class SongRequestModule {}
