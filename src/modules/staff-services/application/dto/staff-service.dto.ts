export interface AssignStaffServiceInput {
  staffId: string;
  serviceId: string;
  priceOverride?: number | null;
  durationOverrideMinutes?: number | null;
  depositOverride?: number | null;
  isActive?: boolean;
}

export interface UpdateStaffServiceInput {
  priceOverride?: number | null;
  durationOverrideMinutes?: number | null;
  depositOverride?: number | null;
  isActive?: boolean;
}

export interface StaffServiceOutput {
  id: string;
  staffId: string;
  serviceId: string;
  priceOverride: number | null;
  durationOverrideMinutes: number | null;
  depositOverride: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
