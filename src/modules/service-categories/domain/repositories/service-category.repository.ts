import { ServiceCategory } from '../entities/service-category';

export const SERVICE_CATEGORY_REPOSITORY = Symbol(
  'SERVICE_CATEGORY_REPOSITORY',
);

export interface ServiceCategoryRepository {
  save(category: ServiceCategory): Promise<void>;
  findById(id: string): Promise<ServiceCategory | null>;
  findByClinicIdAndSlug(
    clinicId: string,
    slug: string,
  ): Promise<ServiceCategory | null>;
  findByClinicId(clinicId: string): Promise<ServiceCategory[]>;
  findAll(): Promise<ServiceCategory[]>;
  delete(id: string): Promise<void>;
}
