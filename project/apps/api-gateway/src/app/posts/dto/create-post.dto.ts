import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export enum PostType {
  Video = 'video',
  Text = 'text',
  Quote = 'quote',
  Photo = 'photo',
  Link = 'link',
}

export class CreatePostDto {
  @ApiProperty({
    description: 'Тип публикации',
    enum: PostType,
    example: PostType.Text,
  })
  @IsEnum(PostType)
  public type!: PostType;

  @ApiPropertyOptional({
    description: 'Заголовок (для video/text)',
    minLength: 20,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @Length(20, 50)
  public title?: string;

  @ApiPropertyOptional({
    description: 'Анонс (для text)',
    minLength: 50,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(50, 255)
  public announcement?: string;

  @ApiPropertyOptional({
    description: 'Текст (для text)',
    minLength: 100,
    maxLength: 1024,
  })
  @IsOptional()
  @IsString()
  @Length(100, 1024)
  public text?: string;

  @ApiPropertyOptional({
    description: 'Текст цитаты (для quote)',
    minLength: 20,
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @Length(20, 300)
  public quoteText?: string;

  @ApiPropertyOptional({
    description: 'Автор цитаты (для quote)',
    minLength: 3,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  public quoteAuthor?: string;

  @ApiPropertyOptional({ description: 'Ссылка на YouTube (для video)' })
  @IsOptional()
  @IsString()
  public videoUrl?: string;

  @ApiPropertyOptional({ description: 'Ссылка на фото (для photo)' })
  @IsOptional()
  @IsString()
  public photoUrl?: string;

  @ApiPropertyOptional({ description: 'URL (для link)' })
  @IsOptional()
  @IsUrl()
  public linkUrl?: string;

  @ApiPropertyOptional({
    description: 'Описание ссылки (для link)',
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  public linkDescription?: string;

  @ApiPropertyOptional({
    description: 'Теги (до 8 шт.)',
    example: ['nestjs', 'backend'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public tags?: string[];
}
