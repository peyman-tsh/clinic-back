import { Inject, Injectable } from '@nestjs/common';
import { StaffNotFoundError } from '../../domain/errors/staff.errors';
import { STAFF_REPOSITORY, type StaffRepository } from '../../domain/repositories/staff.repository';
import { StaffOutput } from '../dto/staff.dto';

@Injectable()
export class FindStaffUseCase {
  constructor(
    @Inject(STAFF_REPOSITORY)
    private readonly staffRepo: StaffRepository,
  ) {}

  async execute(id: string): Promise<StaffOutput> {
    const staff = await this.staffRepo.findById(id);
    if (!staff) {
      throw new StaffNotFoundError(id);
    }
    return staff.toProperties();
  }
}
