import { ClinicStatus } from '../../domain/entities/clinic';

export interface CreateClinicInput {
  name: string;
  slug?: string;
  description?: string | null;
  logoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  timezone?: string;
  currency?: string;
  status?: ClinicStatus;
}

export interface UpdateClinicInput {
  name?: string;
  slug?: string;
  description?: string | null;
  logoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  timezone?: string;
  currency?: string;
  status?: ClinicStatus;
}

export interface ClinicOutput {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  timezone: string;
  currency: string;
  status: ClinicStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
