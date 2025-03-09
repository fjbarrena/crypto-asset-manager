import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';

export class CreateUserRequest {
  @ApiProperty({
    description: 'Unique username',
  })
  username: string;

  @ApiProperty({
    description: 'Plain password (will be encrypted on the database)',
  })
  plainPassword: string;

  @ApiProperty({
    description: 'Role of the user',
  })
  role: Role;
}
