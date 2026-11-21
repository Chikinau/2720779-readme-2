import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Headers,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentRdo } from './rdo/comment.rdo';
import { GetCommentsQueryDto } from './dto/get-comments-query.dto';

@ApiTags('comments')
@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('posts/:postId/comments')
  @ApiOkResponse({ description: 'Комментарий создан', type: CommentRdo })
  public async create(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.create(postId, dto.userId, dto);
  }

  @Get('posts/:postId/comments')
  @ApiOkResponse({ description: 'Список комментариев', type: [CommentRdo] })
  public async findByPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() query: GetCommentsQueryDto,
  ) {
    return this.commentService.findByPost(postId, query.page, query.limit);
  }

  @Delete('comments/:id')
  @ApiOkResponse({ description: 'Комментарий удалён' })
  public async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-user-id') userId: string,
  ) {
    await this.commentService.delete(id, userId);
  }
}
