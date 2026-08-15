import { Inject, Injectable } from '@nestjs/common';
import { BRANCH_REPOSITORY, type BranchRepository } from '../../domain/repositories/branch.repository';
import { BranchOutput } from '../dto/branch.dto';

@Injectable()
export class FindBranchesUseCase {
  constructor(
    @Inject(BRANCH_REPOSITORY)
    private readonly branches: BranchRepository,
  ) {}

  async execute(): Promise<BranchOutput[]> {
    const list = await this.branches.findAll();
    return list.map((branch) => branch.toProperties());
  }
}
