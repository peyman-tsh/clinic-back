import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { StaffServiceIdGenerator } from '../../application/ports/staff-service-id-generator';

@Injectable()
export class UuidStaffServiceIdGenerator implements StaffServiceIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
