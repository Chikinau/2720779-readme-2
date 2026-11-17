import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class TriggerDigestDto {
  @ApiProperty({
    description: 'Email получателя',
    example: 'test@example.com',
  })
  @IsEmail()
  public email!: string;

  @ApiPropertyOptional({
    description: 'Имя получателя (для приветствия в письме)',
    example: 'Иван',
  })
  @IsOptional()
  @IsString()
  public name?: string;
}
