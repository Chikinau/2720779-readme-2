import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RabbitRouting } from '@project/shared-types';
import { getNotifyConfig } from '../app.config';
import { TriggerDigestDto } from './dto/trigger-digest.dto';

@ApiTags('notify')
@Controller('notify')
export class NotifyController {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  @Post('trigger')
  @ApiOperation({
    summary:
      'Запустить процесс отправки рассылки (публикует событие в RabbitMQ)',
  })
  @ApiOkResponse({ description: 'Событие отправлено в очередь' })
  public async trigger(@Body() dto: TriggerDigestDto) {
    const config = getNotifyConfig();
    await this.amqpConnection.publish(
      config.rabbit.exchange,
      RabbitRouting.NotifySendDigest,
      { email: dto.email },
    );
    return { success: true, message: 'Событие отправлено в очередь' };
  }
}
