import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SecurityService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, plainPassword: string): Promise<any> {
    const user = await this.userService.findByUsername(username);

    if (user) {
      console.log('Found user ' + user.username);
      const payload = { sub: user.id, username: user.username };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  static hashPassword(plainPassword: string): string {
    return bcrypt.hashSync(plainPassword);
  }
}
