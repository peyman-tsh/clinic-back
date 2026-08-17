import { Inject, Injectable } from '@nestjs/common';
import { Staff } from '../../domain/entities/staff';
import { UserAlreadyHasStaffProfileError } from '../../domain/errors/staff.errors';
import {
  STAFF_REPOSITORY,
  type StaffRepository,
} from '../../domain/repositories/staff.repository';
import {
  CLINIC_REPOSITORY,
  type ClinicRepository,
} from '../../../clinics/domain/repositories/clinic.repository';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../../users/domain/repositories/user.repository';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';
import { UserNotFoundError } from '../../../users/domain/errors/user.errors';
import { CreateStaffInput, StaffOutput } from '../dto/staff.dto';
import {
  STAFF_ID_GENERATOR,
  type StaffIdGenerator,
} from '../ports/staff-id-generator';

@Injectable()
export class CreateStaffUseCase {
  constructor(
    @Inject(STAFF_REPOSITORY)
    private readonly staffRepo: StaffRepository,
    @Inject(USER_REPOSITORY)
    private readonly usersRepo: UserRepository,
    @Inject(CLINIC_REPOSITORY)
    private readonly clinicsRepo: ClinicRepository,
    @Inject(STAFF_ID_GENERATOR)
    private readonly idGenerator: StaffIdGenerator,
  ) {}

  async execute(input: CreateStaffInput): Promise<StaffOutput> {
    const user = await this.usersRepo.findById(input.userId);
    if (!user) {
      throw new UserNotFoundError(input.userId);
    }

    const clinic = await this.clinicsRepo.findById(input.clinicId);
    if (!clinic) {
      throw new ClinicNotFoundError(input.clinicId);
    }

    const existingStaff = await this.staffRepo.findByUserId(input.userId);
    if (existingStaff) {
      throw new UserAlreadyHasStaffProfileError(input.userId);
    }

    const id = this.idGenerator.generate();
    const staff = Staff.create({
      id,
      ...input,
    });

    await this.staffRepo.save(staff);
    return staff.toProperties();
  }
}
