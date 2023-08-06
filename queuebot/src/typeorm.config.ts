import { DataSource } from 'typeorm';
import {Channel} from "./modules/data-store/entities/channel.entity";
import {Migration1691072991387} from "../migrations/1691072991387-migration";

export default new DataSource({
    type: 'sqlite',
    database: 'queuebot.db',
    entities: [Channel],
    migrations: [Migration1691072991387],
});
