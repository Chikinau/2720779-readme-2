import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRdo } from './rdo/post.rdo';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { GetDraftsQueryDto } from './dto/get-drafts-query';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOkResponse({ description: 'Публикация создана', type: PostRdo })
  public async create(@Body() dto: CreatePostDto) {
    return this.postService.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: 'Список публикаций', type: [PostRdo] })
  public async findMany(@Query() query: GetPostsQueryDto) {
    return this.postService.findMany(query);
  }

  @Get('drafts')
  @ApiOkResponse({ description: 'Список черновиков автора', type: [PostRdo] })
  public async findDrafts(@Query() query: GetDraftsQueryDto) {
    return this.postService.findDraftsByAuthor(query.authorId);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Детальная информация о публикации',
    type: PostRdo,
  })
  public async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.postService.getById(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Публикация обновлена', type: PostRdo })
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postService.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Публикация удалена' })
  public async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.postService.delete(id);
  }

  @Post(':id/repost')
  @ApiOkResponse({ description: 'Репост создан', type: PostRdo })
  public async repost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('authorId') authorId: string,
  ) {
    return this.postService.repost(id, authorId);
  }
}
