import { Inject, Injectable } from '@nestjs/common';
import {
  STAFF_SERVICE_REPOSITORY,
  type StaffServiceRepository,
} from '../../domain/repositories/staff-service.repository';
import { StaffServiceNotFoundError } from '../../domain/errors/staff-service.errors';

@Injectable()
export class RemoveStaffServiceUseCase {
  constructor(
    @Inject(STAFF_SERVICE_REPOSITORY)
    private readonly staffServiceRepository: StaffServiceRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.staffServiceRepository.findById(id);

    if (!existing) {
      throw new StaffServiceNotFoundError(id);
    }

    await this.staffServiceRepository.delete(id);
  }
}
