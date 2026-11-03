import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';
import { PostType } from '@project/shared-types';
import { TAG_MAX_LENGTH, TAG_MIN_LENGTH, TAGS_MAX_COUNT } from '../post.consts';

export class CreatePostDto {
  @ApiProperty({
    description: 'Тип публикации',
    enum: PostType,
    example: PostType.Text,
  })
  @IsEnum(PostType)
  public type!: PostType;

  @ApiProperty({ description: 'ID автора публикации', example: '7b1a59a9-...' })
  @IsString()
  public authorId!: string;

  @ApiPropertyOptional({
    description: 'Название публикации (для видео и текста, 20-50 символов)',
    example: 'Мой первый пост',
    minLength: 20,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @Length(20, 50)
  public title?: string;

  @ApiPropertyOptional({
    description: 'Анонс публикации (50-255 символов)',
    minLength: 50,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(50, 255)
  public announcement?: string;

  @ApiPropertyOptional({
    description: 'Текст публикации (100-1024 символов)',
    minLength: 100,
    maxLength: 1024,
  })
  @IsOptional()
  @IsString()
  @Length(100, 1024)
  public text?: string;

  @ApiPropertyOptional({
    description: 'Текст цитаты (20-300 символов)',
    minLength: 20,
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @Length(20, 300)
  public quoteText?: string;

  @ApiPropertyOptional({
    description: 'Автор цитаты (3-50 символов)',
    minLength: 3,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  public quoteAuthor?: string;

  @ApiPropertyOptional({
    description: 'Ссылка на YouTube',
    example: 'https://youtube.com/watch?v=...',
  })
  @IsOptional()
  @IsString()
  public videoUrl?: string;

  @ApiPropertyOptional({
    description: 'Ссылка на фото (URL, который вернёт files-сервис)',
  })
  @IsOptional()
  @IsString()
  public photoUrl?: string;

  @ApiPropertyOptional({ description: 'URL для публикации типа "Ссылка"' })
  @IsOptional()
  @IsUrl()
  public linkUrl?: string;

  @ApiPropertyOptional({
    description: 'Описание ссылки (до 300 символов)',
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  public linkDescription?: string;

  @ApiPropertyOptional({
    description: `Список тегов (до ${TAGS_MAX_COUNT} шт., каждый ${TAG_MIN_LENGTH}-${TAG_MAX_LENGTH} символов, без пробелов)`,
    example: ['nestjs', 'backend'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(TAG_MIN_LENGTH, TAG_MAX_LENGTH, { each: true })
  @ArrayMaxSize(TAGS_MAX_COUNT)
  public tags?: string[];
}
