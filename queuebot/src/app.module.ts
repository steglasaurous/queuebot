import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataStoreModule } from './modules/data-store/data-store.module';
import {ChatModule} from "./modules/chat/chat.module";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {ConfigModule} from "@nestjs/config";
import { BotCommandsModule } from './modules/bot-commands/bot-commands.module';
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [DataStoreModule, ChatModule, EventEmitterModule.forRoot(), ConfigModule.forRoot(), BotCommandsModule, TypeOrmModule.forRoot({
    database: 'queuebot.db',
    type: 'sqlite',
    autoLoadEntities: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
