import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentRdo } from './rdo/comment.rdo';

@ApiTags('comments')
@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('posts/:postId/comments')
  @ApiOkResponse({ description: 'Комментарий создан', type: CommentRdo })
  public async create(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.create(postId, dto.userId, dto);
  }

  @Get('posts/:postId/comments')
  @ApiOkResponse({ description: 'Список комментариев', type: [CommentRdo] })
  public async findByPost(
    @Param('postId') postId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.commentService.findByPost(
      postId,
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
    );
  }

  @Delete('comments/:id')
  @ApiOkResponse({ description: 'Комментарий удалён' })
  public async delete(@Param('id') id: string, @Body('userId') userId: string) {
    await this.commentService.delete(id, userId);
  }
}
