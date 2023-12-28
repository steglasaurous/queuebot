import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DataStoreModule } from './modules/data-store/data-store.module';
import { ChatModule } from './modules/chat/chat.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { BotCommandsModule } from './modules/bot-commands/bot-commands.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongStoreModule } from './modules/song-store/song-store.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { SongRequestModule } from './modules/song-request/song-request.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { ApiModule } from './modules/api/api.module';
import { ClientLauncherModule } from './modules/client-launcher/client-launcher.module';
import * as path from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { typeORMAppConfig } from './typeorm.config';
import { MetricsModule } from './modules/metrics/metrics.module';

@Module({
  imports: [
    DataStoreModule,
    ChatModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
    BotCommandsModule,
    TypeOrmModule.forRoot(typeORMAppConfig),
    SongStoreModule,
    ScheduleModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, 'i18n'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
      typesOutputPath: path.join(
        __dirname,
        '../../src/generated/i18n.generated.ts',
      ),
    }),
    SongRequestModule,
    WebsocketModule,
    ApiModule,
    ClientLauncherModule,
    AuthModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
