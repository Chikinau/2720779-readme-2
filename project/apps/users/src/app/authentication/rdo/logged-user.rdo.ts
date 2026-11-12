import { ApiProperty } from '@nestjs/swagger';
import { UserRdo } from './user.rdo';

export class LoggedUserRdo extends UserRdo {
  @ApiProperty({
    description: 'JWT токен доступа (Bearer)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  public accessToken!: string;
}