import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { BranchIdGenerator } from '../../application/ports/branch-id-generator';

@Injectable()
export class UuidBranchIdGenerator implements BranchIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
