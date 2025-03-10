import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginRequest {
  @ApiProperty({
    description: 'Unique username',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Plain password',
  })
  @IsString()
  plainPassword: string;
}
