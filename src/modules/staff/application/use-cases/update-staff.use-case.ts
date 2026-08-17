import { Inject, Injectable } from '@nestjs/common';
import { StaffNotFoundError } from '../../domain/errors/staff.errors';
import {
  STAFF_REPOSITORY,
  type StaffRepository,
} from '../../domain/repositories/staff.repository';
import { StaffOutput, UpdateStaffInput } from '../dto/staff.dto';

@Injectable()
export class UpdateStaffUseCase {
  constructor(
    @Inject(STAFF_REPOSITORY)
    private readonly staffRepo: StaffRepository,
  ) {}

  async execute(id: string, input: UpdateStaffInput): Promise<StaffOutput> {
    const staff = await this.staffRepo.findById(id);
    if (!staff) {
      throw new StaffNotFoundError(id);
    }

    staff.update(input);
    await this.staffRepo.save(staff);
    return staff.toProperties();
  }
}
