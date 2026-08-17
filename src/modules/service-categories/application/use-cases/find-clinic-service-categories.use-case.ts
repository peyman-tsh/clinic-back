import { Inject, Injectable } from '@nestjs/common';
import {
  CLINIC_REPOSITORY,
  type ClinicRepository,
} from '../../../clinics/domain/repositories/clinic.repository';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';
import {
  SERVICE_CATEGORY_REPOSITORY,
  type ServiceCategoryRepository,
} from '../../domain/repositories/service-category.repository';
import { ServiceCategoryOutput } from '../dto/service-category.dto';

@Injectable()
export class FindClinicServiceCategoriesUseCase {
  constructor(
    @Inject(SERVICE_CATEGORY_REPOSITORY)
    private readonly categoriesRepo: ServiceCategoryRepository,
    @Inject(CLINIC_REPOSITORY)
    private readonly clinicsRepo: ClinicRepository,
  ) {}

  async execute(clinicId: string): Promise<ServiceCategoryOutput[]> {
    const clinic = await this.clinicsRepo.findById(clinicId);
    if (!clinic) {
      throw new ClinicNotFoundError(clinicId);
    }

    const list = await this.categoriesRepo.findByClinicId(clinicId);
    return list.map((category) => category.toProperties());
  }
}
