import { Inject, Injectable } from '@nestjs/common';
import { BranchNotFoundError } from '../../domain/errors/branch.errors';
import {
  BRANCH_REPOSITORY,
  type BranchRepository,
} from '../../domain/repositories/branch.repository';
import { BranchOutput } from '../dto/branch.dto';

@Injectable()
export class FindBranchUseCase {
  constructor(
    @Inject(BRANCH_REPOSITORY)
    private readonly branches: BranchRepository,
  ) {}

  async execute(id: string): Promise<BranchOutput> {
    const branch = await this.branches.findById(id);
    if (!branch) {
      throw new BranchNotFoundError(id);
    }
    return branch.toProperties();
  }
}
