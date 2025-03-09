import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export class BcryptService {
  static hashPassword(plainPassword: string): string {
    return bcrypt.hashSync(plainPassword);
  }

  /**
   * Checks if provided plain text password matches with provided hashed password
   * @param passwordToCheck Password to check in plain text
   * @param hashedPassword Password hashed
   * @returns true if both are equals, false in other case
   */
  static async isPasswordCorrect(
    passwordToCheck,
    hashedPassword,
  ): Promise<boolean> {
    return bcrypt.compare(passwordToCheck, hashedPassword);
  }
}
