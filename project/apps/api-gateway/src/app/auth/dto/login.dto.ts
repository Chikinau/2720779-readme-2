import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Email (логин)', example: 'user@example.com' })
  @IsEmail()
  public email!: string;

  @ApiProperty({
    description: 'Пароль',
    example: 'qwerty123',
    minLength: 6,
    maxLength: 12,
  })
  @IsString()
  @Length(6, 12)
  public password!: string;
}
