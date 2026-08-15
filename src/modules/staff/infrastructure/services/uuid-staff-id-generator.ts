import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { StaffIdGenerator } from '../../application/ports/staff-id-generator';

@Injectable()
export class UuidStaffIdGenerator implements StaffIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
