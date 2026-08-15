import { Staff, StaffBranchProperties } from '../entities/staff';

export const STAFF_REPOSITORY = Symbol('STAFF_REPOSITORY');

export interface StaffRepository {
  save(staff: Staff): Promise<void>;
  findById(id: string): Promise<Staff | null>;
  findByUserId(userId: string): Promise<Staff | null>;
  findByClinicId(clinicId: string): Promise<Staff[]>;
  findAll(): Promise<Staff[]>;
  delete(id: string): Promise<void>;

  assignBranch(assignment: StaffBranchProperties): Promise<void>;
  removeBranch(staffId: string, branchId: string): Promise<void>;
}
