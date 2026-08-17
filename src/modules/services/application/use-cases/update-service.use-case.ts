import { Inject, Injectable } from '@nestjs/common';
import { CategoryDoesNotBelongToClinicError, ServiceNotFoundError, ServiceSlugAlreadyInUseError } from '../../domain/errors/service.errors';
import { SERVICE_REPOSITORY, type ServiceRepository } from '../../domain/repositories/service.repository';
import { SERVICE_CATEGORY_REPOSITORY, type ServiceCategoryRepository } from '../../../service-categories/domain/repositories/service-category.repository';
import { ServiceCategoryNotFoundError } from '../../../service-categories/domain/errors/service-category.errors';
import { ServiceOutput, UpdateServiceInput } from '../dto/service.dto';

@Injectable()
export class UpdateServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly servicesRepo: ServiceRepository,
    @Inject(SERVICE_CATEGORY_REPOSITORY)
    private readonly categoriesRepo: ServiceCategoryRepository,
  ) {}

  async execute(id: string, input: UpdateServiceInput): Promise<ServiceOutput> {
    const service = await this.servicesRepo.findById(id);
    if (!service) {
      throw new ServiceNotFoundError(id);
    }

    if (input.categoryId !== undefined && input.categoryId !== service.categoryId) {
      const category = await this.categoriesRepo.findById(input.categoryId);
      if (!category) {
        throw new ServiceCategoryNotFoundError(input.categoryId);
      }
      if (category.clinicId !== service.clinicId) {
        throw new CategoryDoesNotBelongToClinicError(input.categoryId, service.clinicId);
      }
    }

    service.update(input);

    const existingBySlug = await this.servicesRepo.findByClinicIdAndSlug(
      service.clinicId,
      service.slug,
    );
    if (existingBySlug && existingBySlug.id !== id) {
      throw new ServiceSlugAlreadyInUseError(service.slug, service.clinicId);
    }

    await this.servicesRepo.save(service);
    return {
      ...service.toProperties(),
      totalOccupiedMinutes: service.totalOccupiedMinutes,
    };
  }
}
