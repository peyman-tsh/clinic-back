import { Inject, Injectable } from '@nestjs/common';
import {
  STAFF_SERVICE_REPOSITORY,
  type StaffServiceRepository,
  type FindStaffServicesFilter,
} from '../../domain/repositories/staff-service.repository';
import type { StaffServiceOutput } from '../dto/staff-service.dto';

@Injectable()
export class FindStaffServicesUseCase {
  constructor(
    @Inject(STAFF_SERVICE_REPOSITORY)
    private readonly staffServiceRepository: StaffServiceRepository,
  ) {}

  async execute(
    filter?: FindStaffServicesFilter,
  ): Promise<StaffServiceOutput[]> {
    const staffServices = await this.staffServiceRepository.findAll(filter);
    return staffServices.map((item) => item.toProperties());
  }
}
