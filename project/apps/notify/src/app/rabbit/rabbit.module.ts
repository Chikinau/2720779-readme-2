import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: `amqp://${configService.get('RABBITMQ_USER')}:${configService.get('RABBITMQ_PASSWORD')}@${configService.get('RABBITMQ_HOST')}:${configService.get('RABBITMQ_PORT')}`,
        exchanges: [
          {
            name: configService.get('RABBITMQ_EXCHANGE') ?? 'readme.notify',
            type: 'topic',
          },
        ],
        connectionInitOptions: { wait: true, timeout: 10000 },
      }),
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitModule {}
