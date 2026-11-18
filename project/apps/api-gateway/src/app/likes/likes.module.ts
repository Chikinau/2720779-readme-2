import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
