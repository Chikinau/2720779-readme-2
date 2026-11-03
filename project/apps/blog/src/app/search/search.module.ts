import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { PostModule } from '../post/post.module';

@Module({
  imports: [PostModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}