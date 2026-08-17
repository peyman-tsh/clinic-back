import { Inject, Injectable } from '@nestjs/common';
import {
  CLINIC_REPOSITORY,
  type ClinicRepository,
} from '../../domain/repositories/clinic.repository';
import { ClinicOutput } from '../dto/clinic.dto';

@Injectable()
export class FindClinicsUseCase {
  constructor(
    @Inject(CLINIC_REPOSITORY)
    private readonly clinics: ClinicRepository,
  ) {}

  async execute(): Promise<ClinicOutput[]> {
    const list = await this.clinics.findAll();
    return list.map((clinic) => clinic.toProperties());
  }
}
