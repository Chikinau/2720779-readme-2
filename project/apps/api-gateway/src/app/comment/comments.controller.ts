import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsQueryDto } from './dto/get-comments-query.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { CommentRdo } from './rdo/comment.rdo';
import { JwtAuthGuard } from '../auth/jwt-autg.guard';

@ApiTags('comments')
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать комментарий (автор из токена)' })
  @ApiCreatedResponse({ description: 'Комментарий создан', type: CommentRdo })
  public async create(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() userId: string,
  ) {
    return this.commentsService.create(postId, userId, dto);
  }

  @Get('posts/:postId/comments')
  @ApiOperation({ summary: 'Список комментариев публикации (с авторами)' })
  @ApiOkResponse({ description: 'Список комментариев', type: [CommentRdo] })
  public async findByPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() query: GetCommentsQueryDto,
  ) {
    return this.commentsService.findByPost(postId, query);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить свой комментарий' })
  @ApiOkResponse({ description: 'Комментарий удалён' })
  public async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() userId: string,
  ) {
    return this.commentsService.delete(id, userId);
  }
}
