import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty({
    description: 'JWT access token',
  })
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }
}
