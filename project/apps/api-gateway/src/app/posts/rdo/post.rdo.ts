import { ApiProperty } from '@nestjs/swagger';

export class PostAuthorRdo {
  @ApiProperty({ description: 'ID автора' })
  public id!: string;

  @ApiProperty({ description: 'Имя автора' })
  public name!: string;

  @ApiProperty({ description: 'Email автора' })
  public email!: string;
}

export class PostRdo {
  @ApiProperty({ description: 'ID публикации' })
  public id!: string;

  @ApiProperty({ description: 'Тип публикации' })
  public type!: string;

  @ApiProperty({ description: 'Заголовок' })
  public title?: string;

  @ApiProperty({ description: 'Теги', type: [String] })
  public tags!: string[];

  @ApiProperty({ description: 'Дата публикации' })
  public publishDate!: Date;

  @ApiProperty({ description: 'Статус' })
  public status!: string;

  @ApiProperty({ description: 'Признак репоста' })
  public isRepost!: boolean;

  @ApiProperty({ description: 'Автор публикации', type: PostAuthorRdo })
  public author!: PostAuthorRdo;

  @ApiProperty({ description: 'Количество лайков', example: 5 })
  public likesCount!: number;

  @ApiProperty({ description: 'Количество комментариев', example: 3 })
  public commentsCount!: number;
}
