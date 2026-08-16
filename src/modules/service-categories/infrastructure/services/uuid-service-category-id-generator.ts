import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { ServiceCategoryIdGenerator } from '../../application/ports/service-category-id-generator';

@Injectable()
export class UuidServiceCategoryIdGenerator implements ServiceCategoryIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
