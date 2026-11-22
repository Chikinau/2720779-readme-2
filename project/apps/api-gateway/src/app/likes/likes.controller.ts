import {
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LikesService } from './likes.service';

import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('likes')
@Controller('posts')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':postId/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Поставить лайк публикации (пользователь из токена)',
  })
  @ApiCreatedResponse({ description: 'Лайк поставлен' })
  public async like(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() userId: string,
  ) {
    return this.likesService.like(postId, userId);
  }

  @Delete(':postId/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Снять лайк с публикации' })
  @ApiOkResponse({ description: 'Лайк снят' })
  public async unlike(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() userId: string,
  ) {
    return this.likesService.unlike(postId, userId);
  }
}
