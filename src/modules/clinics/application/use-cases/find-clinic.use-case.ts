import { Inject, Injectable } from '@nestjs/common';
import { ClinicNotFoundError } from '../../domain/errors/clinic.errors';
import {
  CLINIC_REPOSITORY,
  type ClinicRepository,
} from '../../domain/repositories/clinic.repository';
import { ClinicOutput } from '../dto/clinic.dto';

@Injectable()
export class FindClinicUseCase {
  constructor(
    @Inject(CLINIC_REPOSITORY)
    private readonly clinics: ClinicRepository,
  ) {}

  async execute(id: string): Promise<ClinicOutput> {
    const clinic = await this.clinics.findById(id);
    if (!clinic) {
      throw new ClinicNotFoundError(id);
    }
    return clinic.toProperties();
  }
}
