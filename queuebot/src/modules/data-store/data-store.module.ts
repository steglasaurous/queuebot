import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Channel} from "./entities/channel.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [Channel]
        )
    ]
})
export class DataStoreModule {}
