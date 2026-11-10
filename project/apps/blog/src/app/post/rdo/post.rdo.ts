import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus, PostType } from '@project/shared-types';

export class PostRdo {
  @ApiProperty({ description: 'ID публикации' })
  public id!: string;

  @ApiProperty({ description: 'Тип публикации', enum: PostType })
  public type!: PostType;

  @ApiProperty({ description: 'ID автора' })
  public authorId!: string;

  @ApiPropertyOptional({ description: 'Заголовок' })
  public title?: string;

  @ApiPropertyOptional({ description: 'Теги', type: [String] })
  public tags!: string[];

  @ApiPropertyOptional({ description: 'Анонс (для текста)' })
  public announcement?: string;

  @ApiPropertyOptional({ description: 'Текст (для текста)' })
  public text?: string;

  @ApiPropertyOptional({ description: 'Текст цитаты' })
  public quoteText?: string;

  @ApiPropertyOptional({ description: 'Автор цитаты' })
  public quoteAuthor?: string;

  @ApiPropertyOptional({ description: 'Ссылка на видео' })
  public videoUrl?: string;

  @ApiPropertyOptional({ description: 'Ссылка на фото' })
  public photoUrl?: string;

  @ApiPropertyOptional({ description: 'URL ссылки' })
  public linkUrl?: string;

  @ApiPropertyOptional({ description: 'Описание ссылки' })
  public linkDescription?: string;

  @ApiProperty({ description: 'Дата публикации' })
  public publishDate!: Date;

  @ApiProperty({ description: 'Дата создания' })
  public createDate!: Date;

  @ApiProperty({ description: 'Статус публикации', enum: PostStatus })
  public status!: PostStatus;

  @ApiProperty({ description: 'Признак репоста' })
  public isRepost!: boolean;

  @ApiPropertyOptional({ description: 'ID оригинальной публикации (если репост)' })
  public originalPostId?: string;

  @ApiPropertyOptional({ description: 'ID оригинального автора (если репост)' })
  public originalAuthorId?: string;
}