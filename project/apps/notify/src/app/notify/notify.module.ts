import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitModule } from '../rabbit/rabbit.module';
import { NotifyStateModel, NotifyStateSchema } from './notify-state.model';
import { NotifyStateRepository } from './notify-state.repository';
import { NotifyService } from './notify.service';
import { NotifyConsumer } from './notify.consumer';
import { NotifyController } from './notify.controller';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NotifyStateModel.name, schema: NotifyStateSchema },
    ]),
    RabbitModule,
    HttpModule,
  ],
  controllers: [NotifyController],
  providers: [NotifyStateRepository, NotifyService, NotifyConsumer],
  exports: [NotifyService],
})
export class NotifyModule {}
