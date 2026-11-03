import { forwardRef, Module } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { LikeModule } from '../like/like.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [forwardRef(() => LikeModule), forwardRef(() => CommentModule)],
  controllers: [PostController],
  providers: [PostRepository, PostService],
  exports: [PostRepository],
})
export class PostModule {}
