import { Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RabbitRouting } from '@project/shared-types';
import { getNotifyConfig } from '../app.config';


@ApiTags('notify')
@Controller('notify')
export class NotifyController {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  @Post('trigger')
  @ApiOperation({ summary: 'Запустить рассылку всем пользователям' })
  @ApiOkResponse({ description: 'Рассылка запущена' })
  public async trigger() {
    const config = getNotifyConfig();
    await this.amqpConnection.publish(
      config.rabbit.exchange,
      RabbitRouting.NotifySendDigest,
      {},
    );
    return { success: true, message: 'Рассылка запущена' };
  }
}
