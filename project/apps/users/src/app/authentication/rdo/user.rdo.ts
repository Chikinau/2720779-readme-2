import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@project/shared-types';

export class UserRdo {
  @ApiProperty({
    description: 'Уникальный идентификатор пользователя (Mongo ObjectId)',
    example: '6af5fc63e52f5fc26f81bf3a',
  })
  public id!: string;

  @ApiProperty({
    description: 'Email (логин)',
    example: 'user@example.com',
  })
  public email!: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван Петров',
  })
  public name!: string;

  @ApiProperty({
    description: 'Роль пользователя',
    enum: UserRole,
    example: UserRole.User,
  })
  public role!: UserRole;

  @ApiPropertyOptional({
    description: 'Ссылка на аватар',
    example: 'https://example.com/avatar.jpg',
  })
  public avatar?: string;

  @ApiProperty({
    description: 'Дата регистрации (проставляется автоматически при создании в MongoDB)',
    example: '2026-11-12T17:50:27.795Z',
  })
  public createdAt!: Date;
}