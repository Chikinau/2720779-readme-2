import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Текущий пароль',
    example: 'qwerty123',
    minLength: 6,
    maxLength: 12,
  })
  @IsString()
  @Length(6, 12)
  public currentPassword!: string;

  @ApiProperty({
    description: 'Новый пароль',
    example: 'newpass456',
    minLength: 6,
    maxLength: 12,
  })
  @IsString()
  @Length(6, 12)
  public newPassword!: string;
}
