import { Inject, Injectable } from '@nestjs/common';
import { Service } from '../../domain/entities/service';
import { CategoryDoesNotBelongToClinicError, ServiceSlugAlreadyInUseError } from '../../domain/errors/service.errors';
import { SERVICE_REPOSITORY, type ServiceRepository } from '../../domain/repositories/service.repository';
import { CLINIC_REPOSITORY, type ClinicRepository } from '../../../clinics/domain/repositories/clinic.repository';
import { SERVICE_CATEGORY_REPOSITORY, type ServiceCategoryRepository } from '../../../service-categories/domain/repositories/service-category.repository';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';
import { ServiceCategoryNotFoundError } from '../../../service-categories/domain/errors/service-category.errors';
import { CreateServiceInput, ServiceOutput } from '../dto/service.dto';
import { SERVICE_ID_GENERATOR, type ServiceIdGenerator } from '../ports/service-id-generator';

@Injectable()
export class CreateServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly servicesRepo: ServiceRepository,
    @Inject(CLINIC_REPOSITORY)
    private readonly clinicsRepo: ClinicRepository,
    @Inject(SERVICE_CATEGORY_REPOSITORY)
    private readonly categoriesRepo: ServiceCategoryRepository,
    @Inject(SERVICE_ID_GENERATOR)
    private readonly idGenerator: ServiceIdGenerator,
  ) {}

  async execute(input: CreateServiceInput): Promise<ServiceOutput> {
    const clinic = await this.clinicsRepo.findById(input.clinicId);
    if (!clinic) {
      throw new ClinicNotFoundError(input.clinicId);
    }

    const category = await this.categoriesRepo.findById(input.categoryId);
    if (!category) {
      throw new ServiceCategoryNotFoundError(input.categoryId);
    }

    if (category.clinicId !== input.clinicId) {
      throw new CategoryDoesNotBelongToClinicError(input.categoryId, input.clinicId);
    }

    const id = this.idGenerator.generate();
    const service = Service.create({
      id,
      ...input,
    });

    const existingBySlug = await this.servicesRepo.findByClinicIdAndSlug(
      service.clinicId,
      service.slug,
    );
    if (existingBySlug) {
      throw new ServiceSlugAlreadyInUseError(service.slug, service.clinicId);
    }

    await this.servicesRepo.save(service);
    return {
      ...service.toProperties(),
      totalOccupiedMinutes: service.totalOccupiedMinutes,
    };
  }
}
