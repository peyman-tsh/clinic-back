import { Inject, Injectable } from '@nestjs/common';
import {
  CLINIC_REPOSITORY,
  type ClinicRepository,
} from '../../../clinics/domain/repositories/clinic.repository';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';
import {
  SERVICE_REPOSITORY,
  type ServiceRepository,
} from '../../domain/repositories/service.repository';
import { ServiceOutput } from '../dto/service.dto';

@Injectable()
export class FindClinicServicesUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly servicesRepo: ServiceRepository,
    @Inject(CLINIC_REPOSITORY)
    private readonly clinicsRepo: ClinicRepository,
  ) {}

  async execute(clinicId: string): Promise<ServiceOutput[]> {
    const clinic = await this.clinicsRepo.findById(clinicId);
    if (!clinic) {
      throw new ClinicNotFoundError(clinicId);
    }

    const list = await this.servicesRepo.findByClinicId(clinicId);
    return list.map((service) => ({
      ...service.toProperties(),
      totalOccupiedMinutes: service.totalOccupiedMinutes,
    }));
  }
}
