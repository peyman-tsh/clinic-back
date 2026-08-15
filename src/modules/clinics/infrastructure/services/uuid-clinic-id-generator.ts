import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { ClinicIdGenerator } from '../../application/ports/clinic-id-generator';

@Injectable()
export class UuidClinicIdGenerator implements ClinicIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
