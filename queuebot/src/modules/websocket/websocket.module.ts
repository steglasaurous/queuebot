import { Module } from '@nestjs/common';
import { QueueGateway } from './gateways/queue.gateway';

@Module({
  providers: [QueueGateway]
})
export class WebsocketModule {}
