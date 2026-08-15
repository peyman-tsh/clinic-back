import { Inject, Injectable } from '@nestjs/common';
import { Branch } from '../../domain/entities/branch';
import { BranchCodeAlreadyInUseError } from '../../domain/errors/branch.errors';
import { BRANCH_REPOSITORY, type BranchRepository } from '../../domain/repositories/branch.repository';
import { CLINIC_REPOSITORY, type ClinicRepository } from '../../../clinics/domain/repositories/clinic.repository';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';
import { BranchOutput, CreateBranchInput } from '../dto/branch.dto';
import { BRANCH_ID_GENERATOR, type BranchIdGenerator } from '../ports/branch-id-generator';

@Injectable()
export class CreateBranchUseCase {
  constructor(
    @Inject(BRANCH_REPOSITORY)
    private readonly branches: BranchRepository,
    @Inject(CLINIC_REPOSITORY)
    private readonly clinics: ClinicRepository,
    @Inject(BRANCH_ID_GENERATOR)
    private readonly idGenerator: BranchIdGenerator,
  ) {}

  async execute(input: CreateBranchInput): Promise<BranchOutput> {
    const clinic = await this.clinics.findById(input.clinicId);
    if (!clinic) {
      throw new ClinicNotFoundError(input.clinicId);
    }

    const id = this.idGenerator.generate();
    const branch = Branch.create({
      id,
      ...input,
    });

    if (branch.code) {
      const existingByCode = await this.branches.findByClinicIdAndCode(branch.clinicId, branch.code);
      if (existingByCode) {
        throw new BranchCodeAlreadyInUseError(branch.code, branch.clinicId);
      }
    }

    await this.branches.save(branch);
    return branch.toProperties();
  }
}
