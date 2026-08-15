import { Inject, Injectable } from '@nestjs/common';
import { ClinicNotFoundError } from '../../domain/errors/clinic.errors';
import { CLINIC_REPOSITORY, type ClinicRepository } from '../../domain/repositories/clinic.repository';

@Injectable()
export class DeleteClinicUseCase {
  constructor(
    @Inject(CLINIC_REPOSITORY)
    private readonly clinics: ClinicRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const clinic = await this.clinics.findById(id);
    if (!clinic) {
      throw new ClinicNotFoundError(id);
    }
    await this.clinics.delete(id);
  }
}
