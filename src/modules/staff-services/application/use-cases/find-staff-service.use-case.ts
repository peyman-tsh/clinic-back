import { Inject, Injectable } from '@nestjs/common';
import {
  STAFF_SERVICE_REPOSITORY,
  type StaffServiceRepository,
} from '../../domain/repositories/staff-service.repository';
import { StaffServiceNotFoundError } from '../../domain/errors/staff-service.errors';
import type { StaffServiceOutput } from '../dto/staff-service.dto';

@Injectable()
export class FindStaffServiceUseCase {
  constructor(
    @Inject(STAFF_SERVICE_REPOSITORY)
    private readonly staffServiceRepository: StaffServiceRepository,
  ) {}

  async execute(id: string): Promise<StaffServiceOutput> {
    const staffService = await this.staffServiceRepository.findById(id);

    if (!staffService) {
      throw new StaffServiceNotFoundError(id);
    }

    return staffService.toProperties();
  }
}
