import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { BcryptService } from './bcrypt.service';
import { isSuccess } from 'src/model/result.model';

@Injectable()
export class SecurityService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, plainPassword: string): Promise<any> {
    const user = await this.userService.findByUsername(username);

    if (isSuccess(user)) {
      const passwordCorrect = BcryptService.isPasswordCorrect(
        plainPassword,
        user.success.encryptedPassword,
      );

      if (passwordCorrect) {
        const payload = { sub: user.success.id, username: user.success.username };
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
