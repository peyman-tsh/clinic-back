import { Inject, Injectable } from '@nestjs/common';
import { ServiceCategory } from '../../domain/entities/service-category';
import { ServiceCategorySlugAlreadyInUseError } from '../../domain/errors/service-category.errors';
import { SERVICE_CATEGORY_REPOSITORY, type ServiceCategoryRepository } from '../../domain/repositories/service-category.repository';
import { CLINIC_REPOSITORY, type ClinicRepository } from '../../../clinics/domain/repositories/clinic.repository';
import { ClinicNotFoundError } from '../../../clinics/domain/errors/clinic.errors';
import { CreateServiceCategoryInput, ServiceCategoryOutput } from '../dto/service-category.dto';
import { SERVICE_CATEGORY_ID_GENERATOR, type ServiceCategoryIdGenerator } from '../ports/service-category-id-generator';

@Injectable()
export class CreateServiceCategoryUseCase {
  constructor(
    @Inject(SERVICE_CATEGORY_REPOSITORY)
    private readonly categoriesRepo: ServiceCategoryRepository,
    @Inject(CLINIC_REPOSITORY)
    private readonly clinicsRepo: ClinicRepository,
    @Inject(SERVICE_CATEGORY_ID_GENERATOR)
    private readonly idGenerator: ServiceCategoryIdGenerator,
  ) {}

  async execute(input: CreateServiceCategoryInput): Promise<ServiceCategoryOutput> {
    const clinic = await this.clinicsRepo.findById(input.clinicId);
    if (!clinic) {
      throw new ClinicNotFoundError(input.clinicId);
    }

    const id = this.idGenerator.generate();
    const category = ServiceCategory.create({
      id,
      ...input,
    });

    const existingBySlug = await this.categoriesRepo.findByClinicIdAndSlug(
      category.clinicId,
      category.slug,
    );
    if (existingBySlug) {
      throw new ServiceCategorySlugAlreadyInUseError(category.slug, category.clinicId);
    }

    await this.categoriesRepo.save(category);
    return category.toProperties();
  }
}
