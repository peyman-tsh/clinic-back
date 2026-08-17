import { Inject, Injectable } from '@nestjs/common';
import {
  ClinicNotFoundError,
  ClinicSlugAlreadyInUseError,
} from '../../domain/errors/clinic.errors';
import {
  CLINIC_REPOSITORY,
  type ClinicRepository,
} from '../../domain/repositories/clinic.repository';
import { ClinicOutput, UpdateClinicInput } from '../dto/clinic.dto';

@Injectable()
export class UpdateClinicUseCase {
  constructor(
    @Inject(CLINIC_REPOSITORY)
    private readonly clinics: ClinicRepository,
  ) {}

  async execute(id: string, input: UpdateClinicInput): Promise<ClinicOutput> {
    const clinic = await this.clinics.findById(id);
    if (!clinic) {
      throw new ClinicNotFoundError(id);
    }

    if (input.slug && input.slug !== clinic.slug) {
      const existingBySlug = await this.clinics.findBySlug(input.slug);
      if (existingBySlug && existingBySlug.id !== id) {
        throw new ClinicSlugAlreadyInUseError(input.slug);
      }
    }

    clinic.update(input);
    await this.clinics.save(clinic);
    return clinic.toProperties();
  }
}
