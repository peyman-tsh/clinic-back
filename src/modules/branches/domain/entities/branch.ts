import { InvalidBranchError } from '../errors/branch.errors';

export enum BranchStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface BranchProperties {
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

export interface CreateBranchProperties {
  id: string;
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

export interface UpdateBranchProperties {
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

export class Branch {
  private constructor(private properties: BranchProperties) {}

  static create(input: CreateBranchProperties): Branch {
    const now = new Date();

    return new Branch({
      id: input.id,
      clinicId: Branch.validateUuid(input.clinicId, 'Clinic ID'),
      name: Branch.validateName(input.name),
      code: Branch.normalizeOptionalText(input.code),
      email: Branch.normalizeEmail(input.email),
      phone: Branch.normalizeOptionalText(input.phone),
      addressLine1: Branch.validateRequiredText(
        input.addressLine1,
        'Address Line 1',
        255,
      ),
      addressLine2: Branch.normalizeOptionalText(input.addressLine2),
      city: Branch.validateRequiredText(input.city, 'City', 100),
      state: Branch.normalizeOptionalText(input.state),
      postalCode: Branch.normalizeOptionalText(input.postalCode),
      countryCode: Branch.validateCountryCode(input.countryCode),
      latitude: Branch.validateLatitude(input.latitude),
      longitude: Branch.validateLongitude(input.longitude),
      timezone: Branch.normalizeOptionalText(input.timezone),
      status: Branch.validateStatus(input.status ?? BranchStatus.ACTIVE),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  static rehydrate(properties: BranchProperties): Branch {
    return new Branch({ ...properties });
  }

  update(input: UpdateBranchProperties): void {
    if (input.name !== undefined) {
      this.properties.name = Branch.validateName(input.name);
    }
    if (input.code !== undefined) {
      this.properties.code = Branch.normalizeOptionalText(input.code);
    }
    if (input.email !== undefined) {
      this.properties.email = Branch.normalizeEmail(input.email);
    }
    if (input.phone !== undefined) {
      this.properties.phone = Branch.normalizeOptionalText(input.phone);
    }
    if (input.addressLine1 !== undefined) {
      this.properties.addressLine1 = Branch.validateRequiredText(
        input.addressLine1,
        'Address Line 1',
        255,
      );
    }
    if (input.addressLine2 !== undefined) {
      this.properties.addressLine2 = Branch.normalizeOptionalText(
        input.addressLine2,
      );
    }
    if (input.city !== undefined) {
      this.properties.city = Branch.validateRequiredText(
        input.city,
        'City',
        100,
      );
    }
    if (input.state !== undefined) {
      this.properties.state = Branch.normalizeOptionalText(input.state);
    }
    if (input.postalCode !== undefined) {
      this.properties.postalCode = Branch.normalizeOptionalText(
        input.postalCode,
      );
    }
    if (input.countryCode !== undefined) {
      this.properties.countryCode = Branch.validateCountryCode(
        input.countryCode,
      );
    }
    if (input.latitude !== undefined) {
      this.properties.latitude = Branch.validateLatitude(input.latitude);
    }
    if (input.longitude !== undefined) {
      this.properties.longitude = Branch.validateLongitude(input.longitude);
    }
    if (input.timezone !== undefined) {
      this.properties.timezone = Branch.normalizeOptionalText(input.timezone);
    }
    if (input.status !== undefined) {
      this.properties.status = Branch.validateStatus(input.status);
    }

    this.properties.updatedAt = new Date();
  }

  getEffectiveTimezone(clinicTimezone: string): string {
    return this.properties.timezone ?? clinicTimezone;
  }

  get id(): string {
    return this.properties.id;
  }

  get clinicId(): string {
    return this.properties.clinicId;
  }

  get name(): string {
    return this.properties.name;
  }

  get code(): string | null {
    return this.properties.code;
  }

  get email(): string | null {
    return this.properties.email;
  }

  get phone(): string | null {
    return this.properties.phone;
  }

  get addressLine1(): string {
    return this.properties.addressLine1;
  }

  get addressLine2(): string | null {
    return this.properties.addressLine2;
  }

  get city(): string {
    return this.properties.city;
  }

  get state(): string | null {
    return this.properties.state;
  }

  get postalCode(): string | null {
    return this.properties.postalCode;
  }

  get countryCode(): string {
    return this.properties.countryCode;
  }

  get latitude(): number | null {
    return this.properties.latitude;
  }

  get longitude(): number | null {
    return this.properties.longitude;
  }

  get timezone(): string | null {
    return this.properties.timezone;
  }

  get status(): BranchStatus {
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

  toProperties(): BranchProperties {
    return { ...this.properties };
  }

  private static validateUuid(id: string, fieldName: string): string {
    const trimmed = id?.trim();
    if (!trimmed) {
      throw new InvalidBranchError(`${fieldName} is required`);
    }
    return trimmed;
  }

  private static validateName(name: string): string {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new InvalidBranchError('Branch name is required');
    }
    if (trimmed.length > 150) {
      throw new InvalidBranchError('Branch name cannot exceed 150 characters');
    }
    return trimmed;
  }

  private static validateRequiredText(
    value: string,
    fieldName: string,
    maxLength: number,
  ): string {
    const trimmed = value?.trim();
    if (!trimmed) {
      throw new InvalidBranchError(`${fieldName} is required`);
    }
    if (trimmed.length > maxLength) {
      throw new InvalidBranchError(
        `${fieldName} cannot exceed ${maxLength} characters`,
      );
    }
    return trimmed;
  }

  private static validateCountryCode(countryCode: string): string {
    const trimmed = countryCode?.trim().toUpperCase();
    if (!trimmed || trimmed.length !== 2) {
      throw new InvalidBranchError('Country code must be a 2-letter ISO code');
    }
    return trimmed;
  }

  private static validateLatitude(
    latitude: number | null | undefined,
  ): number | null {
    if (latitude === null || latitude === undefined) return null;
    if (latitude < -90 || latitude > 90) {
      throw new InvalidBranchError('Latitude must be between -90 and 90');
    }
    return latitude;
  }

  private static validateLongitude(
    longitude: number | null | undefined,
  ): number | null {
    if (longitude === null || longitude === undefined) return null;
    if (longitude < -180 || longitude > 180) {
      throw new InvalidBranchError('Longitude must be between -180 and 180');
    }
    return longitude;
  }

  private static normalizeEmail(
    email: string | null | undefined,
  ): string | null {
    if (email === null || email === undefined) return null;
    const normalized = email.trim().toLowerCase();
    if (!normalized) return null;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw new InvalidBranchError('A valid email address is required');
    }
    return normalized;
  }

  private static normalizeOptionalText(
    value: string | null | undefined,
  ): string | null {
    if (value === null || value === undefined) return null;
    return value.trim() || null;
  }

  private static validateStatus(status: BranchStatus): BranchStatus {
    if (!Object.values(BranchStatus).includes(status)) {
      throw new InvalidBranchError('Branch status is invalid');
    }
    return status;
  }
}
