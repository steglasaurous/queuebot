import { Module } from '@nestjs/common';
import { DataStoreModule } from './modules/data-store/data-store.module';
import { SongStoreModule } from './modules/song-store/song-store.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMAppConfig } from './typeorm.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DataStoreModule,
    SongStoreModule,
    TypeOrmModule.forRoot(typeORMAppConfig),
  ],
})
export class ImportWorkerModule {}
