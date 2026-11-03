import { ApiProperty } from '@nestjs/swagger';

export class CommentRdo {
  @ApiProperty({ description: 'ID комментария' })
  public id!: string;

  @ApiProperty({ description: 'ID публикации' })
  public postId!: string;

  @ApiProperty({ description: 'ID автора комментария' })
  public userId!: string;

  @ApiProperty({ description: 'Текст комментария' })
  public text!: string;

  @ApiProperty({ description: 'Дата создания' })
  public createDate!: Date;
}
