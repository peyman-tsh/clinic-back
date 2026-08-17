import { Inject, Injectable } from '@nestjs/common';
import {
  CLINIC_REPOSITORY,
  type ClinicRepository,
} from '../../../clinics/domain/repositories/clinic.repository';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';
import {
  BRANCH_REPOSITORY,
  type BranchRepository,
} from '../../domain/repositories/branch.repository';
import { BranchOutput } from '../dto/branch.dto';

@Injectable()
export class FindClinicBranchesUseCase {
  constructor(
    @Inject(BRANCH_REPOSITORY)
    private readonly branches: BranchRepository,
    @Inject(CLINIC_REPOSITORY)
    private readonly clinics: ClinicRepository,
  ) {}

  async execute(clinicId: string): Promise<BranchOutput[]> {
    const clinic = await this.clinics.findById(clinicId);
    if (!clinic) {
      throw new ClinicNotFoundError(clinicId);
    }

    const list = await this.branches.findByClinicId(clinicId);
    return list.map((branch) => branch.toProperties());
  }
}
