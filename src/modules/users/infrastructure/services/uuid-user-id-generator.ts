import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UserIdGenerator } from '../../application/ports/user-id-generator';

@Injectable()
export class UuidUserIdGenerator implements UserIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
