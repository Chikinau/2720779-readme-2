import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Текст комментария (10-300 символов)',
    example: 'Отличная публикация, спасибо за подробный разбор темы!',
    minLength: 10,
    maxLength: 300,
  })
  @IsString()
  @Length(10, 300)
  public text!: string;
}