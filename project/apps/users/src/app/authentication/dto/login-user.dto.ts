import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'user@example.com',
  })
  @IsEmail()
  public email!: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'qwerty123',
    minLength: 6,
    maxLength: 12,
  })
  @IsString()
  @Length(6, 12)
  public password!: string;
}