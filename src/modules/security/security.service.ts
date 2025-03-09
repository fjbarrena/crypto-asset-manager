import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { BcryptService } from './bcrypt.service';

@Injectable()
export class SecurityService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, plainPassword: string): Promise<any> {
    const user = await this.userService.findByUsername(username);

    if (user) {
      const passwordCorrect = BcryptService.isPasswordCorrect(
        plainPassword,
        user.encryptedPassword,
      );

      if (passwordCorrect) {
        const payload = { sub: user.id, username: user.username };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      } else {
        // Give no specific details for security
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  static hashPassword(plainPassword: string): string {
    return bcrypt.hashSync(plainPassword);
  }
}
