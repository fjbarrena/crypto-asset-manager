import { User } from '../entities/user.entity';
import { Fiat } from 'src/model/fiat.enum';
import { Role } from '../enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty()
  username: string;
  
  @ApiProperty({
    enum: Fiat
  })
  balanceCurrency: Fiat;
  
  @ApiProperty()
  id: string;
  
  @ApiProperty({
    enum: Role
  })
  role: Role;

  public static fromEntity(user: User): UserResponse {
    const response = new UserResponse();

    response.username = user.username;
    response.balanceCurrency = user.balanceCurrency;
    response.id = user.id;
    response.role = user.role;

    return response;
  }
}
