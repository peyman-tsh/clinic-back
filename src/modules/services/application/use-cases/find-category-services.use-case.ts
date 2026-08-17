import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_CATEGORY_REPOSITORY, type ServiceCategoryRepository } from '../../../service-categories/domain/repositories/service-category.repository';
import { ServiceCategoryNotFoundError } from '../../../service-categories/domain/errors/service-category.errors';
import { SERVICE_REPOSITORY, type ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceOutput } from '../dto/service.dto';

@Injectable()
export class FindCategoryServicesUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly servicesRepo: ServiceRepository,
    @Inject(SERVICE_CATEGORY_REPOSITORY)
    private readonly categoriesRepo: ServiceCategoryRepository,
  ) {}

  async execute(categoryId: string): Promise<ServiceOutput[]> {
    const category = await this.categoriesRepo.findById(categoryId);
    if (!category) {
      throw new ServiceCategoryNotFoundError(categoryId);
    }

    const list = await this.servicesRepo.findByCategoryId(categoryId);
    return list.map((service) => ({
      ...service.toProperties(),
      totalOccupiedMinutes: service.totalOccupiedMinutes,
    }));
  }
}
