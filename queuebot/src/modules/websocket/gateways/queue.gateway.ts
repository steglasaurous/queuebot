import {MessageBody, SubscribeMessage, WebSocketGateway} from '@nestjs/websockets';

@WebSocketGateway()
export class QueueGateway {
  @SubscribeMessage('subscribe')
  subscribeToChannel(@MessageBody('channelName') channelName: string) {

  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
