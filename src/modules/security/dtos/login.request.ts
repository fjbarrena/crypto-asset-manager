import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {
  @ApiProperty({
    description: 'Unique username',
  })
  username: string;

  @ApiProperty({
    description: 'Plain password',
  })
  plainPassword: string;
}
