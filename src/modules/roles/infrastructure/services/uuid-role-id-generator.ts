import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RoleIdGenerator } from '../../application/ports/role-id-generator';

@Injectable()
export class UuidRoleIdGenerator implements RoleIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
