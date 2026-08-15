import { Clinic } from '../entities/clinic';

export const CLINIC_REPOSITORY = Symbol('CLINIC_REPOSITORY');

export interface ClinicRepository {
  save(clinic: Clinic): Promise<void>;
  findById(id: string): Promise<Clinic | null>;
  findBySlug(slug: string): Promise<Clinic | null>;
  findAll(): Promise<Clinic[]>;
  delete(id: string): Promise<void>;
}
