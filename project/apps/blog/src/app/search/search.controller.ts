import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { PostRdo } from '../post/rdo/post.rdo';
import { SearchQueryDto } from './dto/search-query.dto';

@ApiTags('search')
@Controller('posts')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('search')
  @ApiOkResponse({
    description: 'Результаты поиска публикаций по названию (до 20 шт.)',
    type: [PostRdo],
  })
  @Get('search')
  @ApiOkResponse({
    description: 'Результаты поиска публикаций по названию (до 20 шт.)',
    type: [PostRdo],
  })
  public async search(@Query() query: SearchQueryDto) {
    return this.searchService.searchByTitle(query.title);
  }
}
