import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_CATEGORY_REPOSITORY, type ServiceCategoryRepository } from '../../domain/repositories/service-category.repository';
import { ServiceCategoryOutput } from '../dto/service-category.dto';

@Injectable()
export class FindServiceCategoriesUseCase {
  constructor(
    @Inject(SERVICE_CATEGORY_REPOSITORY)
    private readonly categoriesRepo: ServiceCategoryRepository,
  ) {}

  async execute(): Promise<ServiceCategoryOutput[]> {
    const list = await this.categoriesRepo.findAll();
    return list.map((category) => category.toProperties());
  }
}
