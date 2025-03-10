import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';
import {
  IsAlphanumeric,
  IsEnum,
  IsNumber,
  IsPositive,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserRequest {
  @ApiProperty({
    description: 'Unique username',
  })
  @IsAlphanumeric()
  username: string;

  @ApiProperty({
    description: 'Plain password (will be encrypted on the database)',
  })
  @MinLength(10)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: [
      'Passwords will contain at least 1 upper case letter',
      'Passwords will contain at least 1 lower case letter',
      'Passwords will contain at least 1 number or special character',
    ].join('\n'),
  })
  plainPassword: string;

  @ApiProperty({
    description: 'Role of the user',
  })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    description: 'Initial balance of the user',
  })
  @IsNumber()
  @IsPositive()
  initialBalance: number;
}
