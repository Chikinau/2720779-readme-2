import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@project/shared-types';

export class UserRdo {
  @ApiProperty({ description: 'Уникальный идентификатор', example: '7b1a59a9-...' })
  public id!: string;

  @ApiProperty({ description: 'Email', example: 'user@example.com' })
  public email!: string;

  @ApiProperty({ description: 'Имя пользователя', example: 'Иван Петров' })
  public name!: string;

  @ApiProperty({
    description: 'Роль пользователя',
    enum: UserRole,
    example: UserRole.User,
  })
  public role!: UserRole;

  @ApiPropertyOptional({ description: 'Ссылка на аватар' })
  public avatar?: string;

  @ApiProperty({
    description: 'Дата регистрации',
    example: '2026-11-03T09:27:24.646Z',
  })
  public createdAt!: Date;
}