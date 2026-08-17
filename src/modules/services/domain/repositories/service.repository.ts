import { Service } from '../entities/service';

export const SERVICE_REPOSITORY = Symbol('SERVICE_REPOSITORY');

export interface ServiceRepository {
  save(service: Service): Promise<void>;
  findById(id: string): Promise<Service | null>;
  findByClinicIdAndSlug(clinicId: string, slug: string): Promise<Service | null>;
  findByClinicId(clinicId: string): Promise<Service[]>;
  findByCategoryId(categoryId: string): Promise<Service[]>;
  findAll(): Promise<Service[]>;
  delete(id: string): Promise<void>;
}
