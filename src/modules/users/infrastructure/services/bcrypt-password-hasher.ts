import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';
import type { PasswordHasher } from '../../application/ports/password-hasher';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return hash(password, 12);
  }

  async verify(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
