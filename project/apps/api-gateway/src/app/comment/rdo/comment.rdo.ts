import { ApiProperty } from '@nestjs/swagger';

export class CommentAuthorRdo {
  @ApiProperty({ description: 'ID автора' })
  public id!: string;

  @ApiProperty({ description: 'Имя автора' })
  public name!: string;

  @ApiProperty({ description: 'Email автора' })
  public email!: string;
}

export class CommentRdo {
  @ApiProperty({ description: 'ID комментария' })
  public id!: string;

  @ApiProperty({ description: 'ID публикации' })
  public postId!: string;

  @ApiProperty({ description: 'Текст комментария' })
  public text!: string;

  @ApiProperty({ description: 'Дата создания' })
  public createDate!: Date;

  @ApiProperty({ description: 'Автор комментария', type: CommentAuthorRdo })
  public author!: CommentAuthorRdo;
}
