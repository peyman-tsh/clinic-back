import { Inject, Injectable } from '@nestjs/common';
import { StaffNotFoundError } from '../../domain/errors/staff.errors';
import { STAFF_REPOSITORY, type StaffRepository } from '../../domain/repositories/staff.repository';
import { StaffOutput } from '../dto/staff.dto';

@Injectable()
export class RemoveStaffFromBranchUseCase {
  constructor(
    @Inject(STAFF_REPOSITORY)
    private readonly staffRepo: StaffRepository,
  ) {}

  async execute(staffId: string, branchId: string): Promise<StaffOutput> {
    const staff = await this.staffRepo.findById(staffId);
    if (!staff) {
      throw new StaffNotFoundError(staffId);
    }

    staff.removeBranch(branchId);
    await this.staffRepo.removeBranch(staffId, branchId);
    await this.staffRepo.save(staff);

    return staff.toProperties();
  }
}
