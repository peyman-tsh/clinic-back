import { Inject, Injectable } from '@nestjs/common';
import { Clinic } from '../../domain/entities/clinic';
import { ClinicSlugAlreadyInUseError } from '../../domain/errors/clinic.errors';
import { CLINIC_REPOSITORY, type ClinicRepository } from '../../domain/repositories/clinic.repository';
import { ClinicOutput, CreateClinicInput } from '../dto/clinic.dto';
import { CLINIC_ID_GENERATOR, type ClinicIdGenerator } from '../ports/clinic-id-generator';

@Injectable()
export class CreateClinicUseCase {
  constructor(
    @Inject(CLINIC_REPOSITORY)
    private readonly clinics: ClinicRepository,
    @Inject(CLINIC_ID_GENERATOR)
    private readonly idGenerator: ClinicIdGenerator,
  ) {}

  async execute(input: CreateClinicInput): Promise<ClinicOutput> {
    const id = this.idGenerator.generate();
    const clinic = Clinic.create({
      id,
      ...input,
    });

    const existingBySlug = await this.clinics.findBySlug(clinic.slug);
    if (existingBySlug) {
      throw new ClinicSlugAlreadyInUseError(clinic.slug);
    }

    await this.clinics.save(clinic);
    return clinic.toProperties();
  }
}
