import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRdo } from './rdo/post.rdo';

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
  public async findMany(
    @Query('authorId') authorId?: string,
    @Query('type') type?: string,
    @Query('tag') tag?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.postService.findMany({
      authorId,
      type,
      tag,
      sort,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Детальная информация о публикации', type: PostRdo })
  public async getById(@Param('id') id: string) {
    return this.postService.getById(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Публикация обновлена', type: PostRdo })
  public async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postService.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Публикация удалена' })
  public async delete(@Param('id') id: string) {
    await this.postService.delete(id);
  }

  @Post(':id/repost')
  @ApiOkResponse({ description: 'Репост создан', type: PostRdo })
  public async repost(@Param('id') id: string, @Body('authorId') authorId: string) {
    return this.postService.repost(id, authorId);
  }
}