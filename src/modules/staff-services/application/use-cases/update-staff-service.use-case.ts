import { Inject, Injectable } from '@nestjs/common';
import {
  STAFF_SERVICE_REPOSITORY,
  type StaffServiceRepository,
} from '../../domain/repositories/staff-service.repository';
import { StaffServiceNotFoundError } from '../../domain/errors/staff-service.errors';
import type {
  StaffServiceOutput,
  UpdateStaffServiceInput,
} from '../dto/staff-service.dto';

@Injectable()
export class UpdateStaffServiceUseCase {
  constructor(
    @Inject(STAFF_SERVICE_REPOSITORY)
    private readonly staffServiceRepository: StaffServiceRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateStaffServiceInput,
  ): Promise<StaffServiceOutput> {
    const staffService = await this.staffServiceRepository.findById(id);

    if (!staffService) {
      throw new StaffServiceNotFoundError(id);
    }

    staffService.update(input);

    await this.staffServiceRepository.save(staffService);

    return staffService.toProperties();
  }
}
