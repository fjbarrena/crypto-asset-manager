import { User } from '../entities/user.entity';
import { Fiat } from 'src/model/fiat.enum';
import { Role } from '../enums/role.enum';

export class UserResponse {
  username: string;
  balanceCurrency: Fiat;
  id: string;
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
