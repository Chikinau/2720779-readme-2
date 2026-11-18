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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { CreatePostDto } from './dto/create-post.dto';

import { CurrentUser } from '../auth/current-user.decorator';
import { PostRdo } from './rdo/post.rdo';
import { JwtAuthGuard } from '../auth/jwt-autg.guard';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Поиск публикаций по названию' })
  @ApiOkResponse({ description: 'Результаты поиска', type: [PostRdo] })
  public async search(@Query('title') title: string) {
    return this.postsService.search(title ?? '');
  }

  @Get('drafts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Черновики текущего автора' })
  @ApiOkResponse({ description: 'Список черновиков', type: [PostRdo] })
  public async drafts(@CurrentUser() userId: string) {
    return this.postsService.findDrafts(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Список публикаций (с агрегацией авторов)' })
  @ApiOkResponse({ description: 'Список публикаций', type: [PostRdo] })
  public async findMany(@Query() query: GetPostsQueryDto) {
    return this.postsService.findMany(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Детальная информация о публикации' })
  @ApiOkResponse({ description: 'Публикация', type: PostRdo })
  public async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать публикацию (автор из токена)' })
  @ApiCreatedResponse({ description: 'Публикация создана' })
  public async create(
    @Body() dto: CreatePostDto,
    @CurrentUser() userId: string,
  ) {
    return this.postsService.create(dto, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить публикацию' })
  @ApiOkResponse({ description: 'Публикация обновлена' })
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreatePostDto>,
  ) {
    return this.postsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить публикацию' })
  @ApiOkResponse({ description: 'Публикация удалена' })
  public async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.delete(id);
  }

  @Post(':id/repost')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Репост публикации' })
  @ApiCreatedResponse({ description: 'Репост создан' })
  public async repost(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() userId: string,
  ) {
    return this.postsService.repost(id, userId);
  }
}
