import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { ConfigService } from '@nestjs/config';
import { isMainThread } from 'worker_threads';
import { ImportWorkerModule } from './import-worker.module';
import { SongImporterManagerService } from './modules/song-store/services/song-importer-manager.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  if (isMainThread) {
    const app = await NestFactory.create(AppModule);
    app.useWebSocketAdapter(new WsAdapter(app));
    const config = await app.get(ConfigService);
    app.enableCors({
      credentials: true,
      origin: 'http://localhost:4200',
    });
    await app.listen(config.get('PORT') ?? 3000);
  } else {
    // This is VERY simplistic for now - if started as a worker, assume it's to
    // execute importers.  Run the importers, then when finished, exit.
    const app = await NestFactory.createApplicationContext(ImportWorkerModule);
    const logger = new Logger('worker-main');
    const songImporterManagerService = app.get<SongImporterManagerService>(
      SongImporterManagerService,
    );
    await songImporterManagerService.runImporters();
    logger.log('Worker: Finished running importers. Shutting down worker.');
    await app.close();
  }
}
bootstrap();
