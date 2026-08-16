import { Inject, Injectable } from '@nestjs/common';
import { ServiceCategorySlugAlreadyInUseError, ServiceCategoryNotFoundError } from '../../domain/errors/service-category.errors';
import { SERVICE_CATEGORY_REPOSITORY, type ServiceCategoryRepository } from '../../domain/repositories/service-category.repository';
import { ServiceCategoryOutput, UpdateServiceCategoryInput } from '../dto/service-category.dto';

@Injectable()
export class UpdateServiceCategoryUseCase {
  constructor(
    @Inject(SERVICE_CATEGORY_REPOSITORY)
    private readonly categoriesRepo: ServiceCategoryRepository,
  ) {}

  async execute(id: string, input: UpdateServiceCategoryInput): Promise<ServiceCategoryOutput> {
    const category = await this.categoriesRepo.findById(id);
    if (!category) {
      throw new ServiceCategoryNotFoundError(id);
    }

    category.update(input);

    const existingBySlug = await this.categoriesRepo.findByClinicIdAndSlug(
      category.clinicId,
      category.slug,
    );
    if (existingBySlug && existingBySlug.id !== id) {
      throw new ServiceCategorySlugAlreadyInUseError(category.slug, category.clinicId);
    }

    await this.categoriesRepo.save(category);
    return category.toProperties();
  }
}
