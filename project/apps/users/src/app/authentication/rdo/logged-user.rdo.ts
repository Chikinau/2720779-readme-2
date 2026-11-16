import { ApiProperty } from '@nestjs/swagger';
import { UserRdo } from './user.rdo';

export class LoggedUserRdo extends UserRdo {
  @ApiProperty({ description: 'Access token (JWT)', example: 'eyJ...' })
  public accessToken!: string;

  @ApiProperty({ description: 'Refresh token (JWT)', example: 'eyJ...' })
  public refreshToken!: string;
}
