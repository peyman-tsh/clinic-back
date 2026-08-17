import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { ServiceIdGenerator } from '../../application/ports/service-id-generator';

@Injectable()
export class UuidServiceIdGenerator implements ServiceIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
