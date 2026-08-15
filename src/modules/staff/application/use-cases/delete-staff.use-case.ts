import { Inject, Injectable } from '@nestjs/common';
import { StaffNotFoundError } from '../../domain/errors/staff.errors';
import { STAFF_REPOSITORY, type StaffRepository } from '../../domain/repositories/staff.repository';

@Injectable()
export class DeleteStaffUseCase {
  constructor(
    @Inject(STAFF_REPOSITORY)
    private readonly staffRepo: StaffRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const staff = await this.staffRepo.findById(id);
    if (!staff) {
      throw new StaffNotFoundError(id);
    }
    await this.staffRepo.delete(id);
  }
}
