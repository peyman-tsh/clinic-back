import { Inject, Injectable } from '@nestjs/common';
import { STAFF_REPOSITORY, type StaffRepository } from '../../domain/repositories/staff.repository';
import { CLINIC_REPOSITORY, type ClinicRepository } from '../../../clinics/domain/repositories/clinic.repository';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';
import { StaffOutput } from '../dto/staff.dto';

@Injectable()
export class FindStaffMembersUseCase {
  constructor(
    @Inject(STAFF_REPOSITORY)
    private readonly staffRepo: StaffRepository,
    @Inject(CLINIC_REPOSITORY)
    private readonly clinicsRepo: ClinicRepository,
  ) {}

  async execute(clinicId?: string): Promise<StaffOutput[]> {
    if (clinicId) {
      const clinic = await this.clinicsRepo.findById(clinicId);
      if (!clinic) {
        throw new ClinicNotFoundError(clinicId);
      }

      const list = await this.staffRepo.findByClinicId(clinicId);
      return list.map((s) => s.toProperties());
    }

    const list = await this.staffRepo.findAll();
    return list.map((s) => s.toProperties());
  }
}
