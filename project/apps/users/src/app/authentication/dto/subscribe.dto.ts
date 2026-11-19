import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class SubscribeDto {
  @ApiProperty({
    description: 'ID пользователя, на которого подписываемся',
    example: '6afdebeadff8943996e6cd4e',
  })
  @IsMongoId()
  public followingId!: string;
}
