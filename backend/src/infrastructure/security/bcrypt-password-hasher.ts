import { Injectable } from '@nestjs/common';
import { PasswordHasher } from '@domain/ports/password-hasher';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  async hash(plainPassword: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(plainPassword, saltOrRounds);
  }

  async compare(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
