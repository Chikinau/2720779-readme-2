import { ApiProperty } from '@nestjs/swagger';

export class TokensRdo {
  @ApiProperty({ description: 'Access token (JWT)', example: 'eyJ...' })
  public accessToken!: string;

  @ApiProperty({ description: 'Refresh token (JWT)', example: 'eyJ...' })
  public refreshToken!: string;
}
