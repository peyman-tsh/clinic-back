import { Branch } from '../entities/branch';

export const BRANCH_REPOSITORY = Symbol('BRANCH_REPOSITORY');

export interface BranchRepository {
  save(branch: Branch): Promise<void>;
  findById(id: string): Promise<Branch | null>;
  findByClinicIdAndCode(clinicId: string, code: string): Promise<Branch | null>;
  findByClinicId(clinicId: string): Promise<Branch[]>;
  findAll(): Promise<Branch[]>;
  delete(id: string): Promise<void>;
}
