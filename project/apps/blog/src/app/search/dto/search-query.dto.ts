import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class SearchQueryDto {
  @ApiProperty({
    description: 'Поисковый запрос по названию публикации',
    example: 'первый',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  public title!: string;
}
