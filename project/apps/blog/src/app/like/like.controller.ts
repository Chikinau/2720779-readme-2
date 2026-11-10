import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LikeService } from './like.service';
import { LikeDto } from './dto/like.dto';

@ApiTags('likes')
@Controller('posts')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':postId/like')
  @ApiOkResponse({ description: 'Лайк поставлен' })
  public async like(@Param('postId') postId: string, @Body() dto: LikeDto) {
    return this.likeService.like(dto.userId, postId);
  }

  @Delete(':postId/like')
  @ApiOkResponse({ description: 'Лайк снят' })
  public async unlike(@Param('postId') postId: string, @Body() dto: LikeDto) {
    await this.likeService.unlike(dto.userId, postId);
    return { success: true };
  }
}
