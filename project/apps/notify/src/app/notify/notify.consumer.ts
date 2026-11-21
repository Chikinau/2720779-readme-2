import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RabbitRouting } from '@project/shared-types';
import { getNotifyConfig } from '../app.config';
import { NotifyService } from './notify.service';

interface SendDigestMessage {
  email: string;
}

@Injectable()
export class NotifyConsumer {
  constructor(private readonly notifyService: NotifyService) {}

  @RabbitSubscribe({
    exchange: getNotifyConfig().rabbit.exchange,
    routingKey: RabbitRouting.NotifySendDigest,
    queue: getNotifyConfig().rabbit.queue,
    queueOptions: {
      durable: true,
    },
  })
  public async handleSendDigest(message: SendDigestMessage): Promise<void> {
    await this.notifyService.sendDigest(message.email);
  }
}
