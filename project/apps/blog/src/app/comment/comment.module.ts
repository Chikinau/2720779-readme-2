import { forwardRef, Module } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PostModule } from '../post/post.module';

@Module({
  imports: [forwardRef(() => PostModule)],
  controllers: [CommentController],
  providers: [CommentRepository, CommentService],
  exports: [CommentRepository, CommentService],
})
export class CommentModule {}
