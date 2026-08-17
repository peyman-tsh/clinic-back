import { InvalidStaffError } from '../errors/staff.errors';

export enum StaffStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
}

export interface StaffBranchProperties {
  id: string;
  staffId: string;
  branchId: string;
  isPrimary: boolean;
  createdAt: Date;
}

export interface StaffProperties {
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
  branches: StaffBranchProperties[];
}

export interface CreateStaffProperties {
  id: string;
  userId: string;
  clinicId: string;
  jobTitle?: string | null;
  bio?: string | null;
  licenseNumber?: string | null;
  color?: string | null;
  status?: StaffStatus;
}

export interface UpdateStaffProperties {
  jobTitle?: string | null;
  bio?: string | null;
  licenseNumber?: string | null;
  color?: string | null;
  status?: StaffStatus;
}

export class Staff {
  private assignedBranches: StaffBranchProperties[] = [];

  private constructor(private properties: StaffProperties) {
    this.assignedBranches = properties.branches ? [...properties.branches] : [];
  }

  static create(input: CreateStaffProperties): Staff {
    const now = new Date();

    return new Staff({
      id: input.id,
      userId: Staff.validateUuid(input.userId, 'User ID'),
      clinicId: Staff.validateUuid(input.clinicId, 'Clinic ID'),
      jobTitle: Staff.normalizeOptionalText(input.jobTitle),
      bio: Staff.normalizeOptionalText(input.bio),
      licenseNumber: Staff.normalizeOptionalText(input.licenseNumber),
      color: Staff.validateHexColor(input.color),
      status: Staff.validateStatus(input.status ?? StaffStatus.ACTIVE),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      branches: [],
    });
  }

  static rehydrate(properties: StaffProperties): Staff {
    return new Staff({ ...properties });
  }

  update(input: UpdateStaffProperties): void {
    if (input.jobTitle !== undefined) {
      this.properties.jobTitle = Staff.normalizeOptionalText(input.jobTitle);
    }
    if (input.bio !== undefined) {
      this.properties.bio = Staff.normalizeOptionalText(input.bio);
    }
    if (input.licenseNumber !== undefined) {
      this.properties.licenseNumber = Staff.normalizeOptionalText(
        input.licenseNumber,
      );
    }
    if (input.color !== undefined) {
      this.properties.color = Staff.validateHexColor(input.color);
    }
    if (input.status !== undefined) {
      this.properties.status = Staff.validateStatus(input.status);
    }

    this.properties.updatedAt = new Date();
  }

  assignBranch(assignment: StaffBranchProperties): void {
    const existingIndex = this.assignedBranches.findIndex(
      (b) => b.branchId === assignment.branchId,
    );

    if (assignment.isPrimary) {
      this.assignedBranches = this.assignedBranches.map((b) => ({
        ...b,
        isPrimary: false,
      }));
    }

    if (existingIndex >= 0) {
      this.assignedBranches[existingIndex] = { ...assignment };
    } else {
      this.assignedBranches.push({ ...assignment });
    }
  }

  removeBranch(branchId: string): void {
    this.assignedBranches = this.assignedBranches.filter(
      (b) => b.branchId !== branchId,
    );
  }

  get id(): string {
    return this.properties.id;
  }

  get userId(): string {
    return this.properties.userId;
  }

  get clinicId(): string {
    return this.properties.clinicId;
  }

  get jobTitle(): string | null {
    return this.properties.jobTitle;
  }

  get bio(): string | null {
    return this.properties.bio;
  }

  get licenseNumber(): string | null {
    return this.properties.licenseNumber;
  }

  get color(): string | null {
    return this.properties.color;
  }

  get status(): StaffStatus {
    return this.properties.status;
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }

  get updatedAt(): Date {
    return this.properties.updatedAt;
  }

  get deletedAt(): Date | null {
    return this.properties.deletedAt;
  }

  get branches(): StaffBranchProperties[] {
    return [...this.assignedBranches];
  }

  get primaryBranch(): StaffBranchProperties | null {
    return this.assignedBranches.find((b) => b.isPrimary) ?? null;
  }

  toProperties(): StaffProperties {
    return {
      ...this.properties,
      branches: [...this.assignedBranches],
    };
  }

  private static validateUuid(id: string, fieldName: string): string {
    const trimmed = id?.trim();
    if (!trimmed) {
      throw new InvalidStaffError(`${fieldName} is required`);
    }
    return trimmed;
  }

  private static validateHexColor(
    color: string | null | undefined,
  ): string | null {
    if (color === null || color === undefined) return null;
    const trimmed = color.trim();
    if (!trimmed) return null;

    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(trimmed)) {
      throw new InvalidStaffError(
        'Color must be a valid hex code (e.g. #FF5733)',
      );
    }
    return trimmed;
  }

  private static normalizeOptionalText(
    value: string | null | undefined,
  ): string | null {
    if (value === null || value === undefined) return null;
    return value.trim() || null;
  }

  private static validateStatus(status: StaffStatus): StaffStatus {
    if (!Object.values(StaffStatus).includes(status)) {
      throw new InvalidStaffError('Staff status is invalid');
    }
    return status;
  }
}
