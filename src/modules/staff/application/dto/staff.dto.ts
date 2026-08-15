import { StaffStatus } from '../../domain/entities/staff';

export interface CreateStaffInput {
  userId: string;
  clinicId: string;
  jobTitle?: string | null;
  bio?: string | null;
  licenseNumber?: string | null;
  color?: string | null;
  status?: StaffStatus;
}

export interface UpdateStaffInput {
  jobTitle?: string | null;
  bio?: string | null;
  licenseNumber?: string | null;
  color?: string | null;
  status?: StaffStatus;
}

export interface AssignBranchInput {
  staffId: string;
  branchId: string;
  isPrimary?: boolean;
}

export interface StaffBranchOutput {
  id: string;
  staffId: string;
  branchId: string;
  isPrimary: boolean;
  createdAt: Date;
}

export interface StaffOutput {
  id: string;
  userId: string;
  clinicId: string;
  jobTitle: string | null;
  bio: string | null;
  licenseNumber: string | null;
  color: string | null;
  status: StaffStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  branches: StaffBranchOutput[];
}
