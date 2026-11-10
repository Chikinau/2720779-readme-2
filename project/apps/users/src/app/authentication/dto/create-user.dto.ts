import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Электронная почта пользователя (уникальный логин)',
    example: 'user@example.com',
  })
  @IsEmail()
  public email!: string;

  @ApiProperty({
    description: 'Имя пользователя (фамилия и имя)',
    example: 'Иван Петров',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @Length(3, 50)
  public name!: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'qwerty123',
    minLength: 6,
    maxLength: 12,
  })
  @IsString()
  @Length(6, 12)
  public password!: string;

  @ApiPropertyOptional({
    description: 'Ссылка на аватар пользователя (опционально)',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  public avatar?: string;
}