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
import { Fiat } from 'src/model/fiat.enum';

export class CreateUserRequest {
  @ApiProperty({
    description: 'Unique username',
  })
  @IsAlphanumeric()
  username: string;

  @ApiProperty({
    description: 'Plain password (will be encrypted on the database)',
    example: 'AtLeast10CharsWithUpperLowerAndNumberOrSpecialCharacter',
  })
  @MinLength(10)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: [
      'Passwords will contain at least 1 upper case letter',
      'Passwords will contain at least 1 lower case letter',
      'Passwords will contain at least 1 number or special character',
    ].join(' - '),
  })
  plainPassword: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: Role,
  })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    description: 'Initial balance of the user',
  })
  @IsNumber()
  @IsPositive()
  initialBalance: number;

  @ApiProperty({
    description: 'Currency in which balance is represented',
    enum: Fiat,
  })
  @IsEnum(Fiat)
  balanceCurrency: Fiat;
}
