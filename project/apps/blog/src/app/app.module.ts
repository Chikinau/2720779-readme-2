import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [SearchModule,PostModule,CommentModule, LikeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

