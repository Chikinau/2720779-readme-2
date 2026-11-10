import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LikeDto {
  @ApiProperty({ description: 'ID пользователя, ставящего лайк', example: 'u1' })
  @IsString()
  public userId!: string;
}