import { Inject, Injectable } from '@nestjs/common';
import { BranchCodeAlreadyInUseError, BranchNotFoundError } from '../../domain/errors/branch.errors';
import { BRANCH_REPOSITORY, type BranchRepository } from '../../domain/repositories/branch.repository';
import { BranchOutput, UpdateBranchInput } from '../dto/branch.dto';

@Injectable()
export class UpdateBranchUseCase {
  constructor(
    @Inject(BRANCH_REPOSITORY)
    private readonly branches: BranchRepository,
  ) {}

  async execute(id: string, input: UpdateBranchInput): Promise<BranchOutput> {
    const branch = await this.branches.findById(id);
    if (!branch) {
      throw new BranchNotFoundError(id);
    }

    if (input.code && input.code !== branch.code) {
      const existingByCode = await this.branches.findByClinicIdAndCode(branch.clinicId, input.code);
      if (existingByCode && existingByCode.id !== id) {
        throw new BranchCodeAlreadyInUseError(input.code, branch.clinicId);
      }
    }

    branch.update(input);
    await this.branches.save(branch);
    return branch.toProperties();
  }
}
