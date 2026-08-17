import { Inject, Injectable } from '@nestjs/common';
import { StaffNotFoundError } from '../../domain/errors/staff.errors';
import {
  BRANCH_REPOSITORY,
  type BranchRepository,
} from '../../../branches/domain/repositories/branch.repository';
import { BranchNotFoundError } from '../../../branches/domain/errors/branch.errors';
import {
  STAFF_REPOSITORY,
  type StaffRepository,
} from '../../domain/repositories/staff.repository';
import { AssignBranchInput, StaffOutput } from '../dto/staff.dto';
import {
  STAFF_ID_GENERATOR,
  type StaffIdGenerator,
} from '../ports/staff-id-generator';

@Injectable()
export class AssignStaffToBranchUseCase {
  constructor(
    @Inject(STAFF_REPOSITORY)
    private readonly staffRepo: StaffRepository,
    @Inject(BRANCH_REPOSITORY)
    private readonly branchesRepo: BranchRepository,
    @Inject(STAFF_ID_GENERATOR)
    private readonly idGenerator: StaffIdGenerator,
  ) {}

  async execute(input: AssignBranchInput): Promise<StaffOutput> {
    const staff = await this.staffRepo.findById(input.staffId);
    if (!staff) {
      throw new StaffNotFoundError(input.staffId);
    }

    const branch = await this.branchesRepo.findById(input.branchId);
    if (!branch) {
      throw new BranchNotFoundError(input.branchId);
    }

    const assignmentId = this.idGenerator.generate();
    const assignment = {
      id: assignmentId,
      staffId: input.staffId,
      branchId: input.branchId,
      isPrimary: input.isPrimary ?? false,
      createdAt: new Date(),
    };

    staff.assignBranch(assignment);
    await this.staffRepo.assignBranch(assignment);
    await this.staffRepo.save(staff);

    return staff.toProperties();
  }
}
