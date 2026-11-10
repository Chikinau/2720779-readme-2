import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(
  OmitType(CreatePostDto, ['type', 'authorId'] as const),
) {
  @ApiPropertyOptional({
    description: 'Дата публикации (можно изменить)',
    example: '2026-11-03T09:27:24.646Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  public publishDate?: Date;
}