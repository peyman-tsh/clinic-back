import { Inject, Injectable } from '@nestjs/common';
import { ServiceCategoryNotFoundError } from '../../domain/errors/service-category.errors';
import {
  SERVICE_CATEGORY_REPOSITORY,
  type ServiceCategoryRepository,
} from '../../domain/repositories/service-category.repository';

@Injectable()
export class DeleteServiceCategoryUseCase {
  constructor(
    @Inject(SERVICE_CATEGORY_REPOSITORY)
    private readonly categoriesRepo: ServiceCategoryRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoriesRepo.findById(id);
    if (!category) {
      throw new ServiceCategoryNotFoundError(id);
    }
    await this.categoriesRepo.delete(id);
  }
}
