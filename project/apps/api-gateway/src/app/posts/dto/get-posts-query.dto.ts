import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum PostSortField {
  DateDesc = 'dateDesc',
  LikesDesc = 'likesDesc',
  CommentsDesc = 'commentsDesc',
}

export class GetPostsQueryDto {
  @ApiPropertyOptional({ description: 'ID автора', example: 'seed-user-1' })
  @IsOptional()
  @IsString()
  public authorId?: string;

  @ApiPropertyOptional({
    description: 'Тип публикации',
    enum: ['video', 'text', 'quote', 'photo', 'link'],
  })
  @IsOptional()
  @IsString()
  public type?: string;

  @ApiPropertyOptional({ description: 'Тег', example: 'nestjs' })
  @IsOptional()
  @IsString()
  public tag?: string;

  @ApiPropertyOptional({
    description: 'Сортировка',
    enum: PostSortField,
    default: PostSortField.DateDesc,
  })
  @IsOptional()
  @IsEnum(PostSortField)
  public sort?: PostSortField;

  @ApiPropertyOptional({
    description: 'Номер страницы',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public page?: number;

  @ApiPropertyOptional({
    description: 'Записей на странице',
    example: 25,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  public limit?: number;
}
