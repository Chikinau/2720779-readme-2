import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetDraftsQueryDto {
  @ApiProperty({
    description: 'ID автора (временно, до подключения авторизации)',
    example: 'seed-user-1',
  })
  @IsString()
  public authorId!: string;
}
