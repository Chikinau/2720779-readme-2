import { forwardRef, Module } from '@nestjs/common';
import { LikeRepository } from './like.repository';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { PostModule } from '../post/post.module';

@Module({
  imports: [forwardRef(() => PostModule)],
  controllers: [LikeController],
  providers: [LikeRepository, LikeService],
  exports: [LikeRepository, LikeService],
})
export class LikeModule {}