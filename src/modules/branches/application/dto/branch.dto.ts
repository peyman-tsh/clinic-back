import { BranchStatus } from '../../domain/entities/branch';

export interface CreateBranchInput {
  clinicId: string;
  name: string;
  code?: string | null;
  email?: string | null;
  phone?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  countryCode: string;
  latitude?: number | null;
  longitude?: number | null;
  timezone?: string | null;
  status?: BranchStatus;
}

export interface UpdateBranchInput {
  name?: string;
  code?: string | null;
  email?: string | null;
  phone?: string | null;
  addressLine1?: string;
  addressLine2?: string | null;
  city?: string;
  state?: string | null;
  postalCode?: string | null;
  countryCode?: string;
  latitude?: number | null;
  longitude?: number | null;
  timezone?: string | null;
  status?: BranchStatus;
}

export interface BranchOutput {
  id: string;
  clinicId: string;
  name: string;
  code: string | null;
  email: string | null;
  phone: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  countryCode: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  status: BranchStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
