import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class UploadFileDto {
  @ApiPropertyOptional({
    description: 'Назначение файла',
    enum: ['avatar', 'post'],
    example: 'post',
  })
  @IsOptional()
  @IsIn(['avatar', 'post'])
  public purpose?: 'avatar' | 'post';
}