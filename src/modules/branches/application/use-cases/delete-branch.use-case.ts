import { Inject, Injectable } from '@nestjs/common';
import { BranchNotFoundError } from '../../domain/errors/branch.errors';
import {
  BRANCH_REPOSITORY,
  type BranchRepository,
} from '../../domain/repositories/branch.repository';

@Injectable()
export class DeleteBranchUseCase {
  constructor(
    @Inject(BRANCH_REPOSITORY)
    private readonly branches: BranchRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const branch = await this.branches.findById(id);
    if (!branch) {
      throw new BranchNotFoundError(id);
    }
    await this.branches.delete(id);
  }
}
