import { StaffService } from '../entities/staff-service';

export const STAFF_SERVICE_REPOSITORY = Symbol('STAFF_SERVICE_REPOSITORY');

export interface FindStaffServicesFilter {
  staffId?: string;
  serviceId?: string;
  isActive?: boolean;
}

export interface StaffServiceRepository {
  save(staffService: StaffService): Promise<void>;
  findById(id: string): Promise<StaffService | null>;
  findByStaffIdAndServiceId(
    staffId: string,
    serviceId: string,
  ): Promise<StaffService | null>;
  findByStaffId(staffId: string): Promise<StaffService[]>;
  findByServiceId(serviceId: string): Promise<StaffService[]>;
  findAll(filter?: FindStaffServicesFilter): Promise<StaffService[]>;
  delete(id: string): Promise<void>;
}
