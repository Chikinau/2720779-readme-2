import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PostType } from '@project/shared-types';

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

  @ApiPropertyOptional({ description: 'Тип публикации', enum: PostType })
  @IsOptional()
  @IsEnum(PostType)
  public type?: PostType;

  @ApiPropertyOptional({ description: 'Тег', example: 'nestjs' })
  @IsOptional()
  @IsString()
  public tag?: string;

  @ApiPropertyOptional({
    description: 'Вариант сортировки',
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
    description: 'Количество записей на странице',
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

  @ApiPropertyOptional({
    description: 'Список ID авторов (для ленты)',
    type: [String],
    example: ['seed-user-1', 'seed-user-2'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public authorIds?: string[];
}
