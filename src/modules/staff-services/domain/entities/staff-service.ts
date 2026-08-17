import { InvalidStaffServiceError } from '../errors/staff-service.errors';

export interface StaffServiceProperties {
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

export interface CreateStaffServiceProperties {
  id: string;
  staffId: string;
  serviceId: string;
  priceOverride?: number | null;
  durationOverrideMinutes?: number | null;
  depositOverride?: number | null;
  isActive?: boolean;
}

export interface UpdateStaffServiceProperties {
  priceOverride?: number | null;
  durationOverrideMinutes?: number | null;
  depositOverride?: number | null;
  isActive?: boolean;
}

export class StaffService {
  private constructor(private properties: StaffServiceProperties) {}

  static create(input: CreateStaffServiceProperties): StaffService {
    const now = new Date();

    const priceOverride = StaffService.validatePriceOverride(
      input.priceOverride,
    );
    const durationOverrideMinutes = StaffService.validateDurationOverride(
      input.durationOverrideMinutes,
    );
    const depositOverride = StaffService.validateDepositOverride(
      input.depositOverride,
      priceOverride,
    );

    return new StaffService({
      id: StaffService.validateUuid(input.id, 'ID'),
      staffId: StaffService.validateUuid(input.staffId, 'Staff ID'),
      serviceId: StaffService.validateUuid(input.serviceId, 'Service ID'),
      priceOverride,
      durationOverrideMinutes,
      depositOverride,
      isActive: input.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });
  }

  static rehydrate(properties: StaffServiceProperties): StaffService {
    return new StaffService({ ...properties });
  }

  update(input: UpdateStaffServiceProperties): void {
    if (input.priceOverride !== undefined) {
      this.properties.priceOverride = StaffService.validatePriceOverride(
        input.priceOverride,
      );
    }
    if (input.durationOverrideMinutes !== undefined) {
      this.properties.durationOverrideMinutes =
        StaffService.validateDurationOverride(input.durationOverrideMinutes);
    }
    if (
      input.depositOverride !== undefined ||
      input.priceOverride !== undefined
    ) {
      const currentDeposit =
        input.depositOverride !== undefined
          ? input.depositOverride
          : this.properties.depositOverride;
      this.properties.depositOverride = StaffService.validateDepositOverride(
        currentDeposit,
        this.properties.priceOverride,
      );
    }
    if (input.isActive !== undefined) {
      this.properties.isActive = input.isActive;
    }

    this.properties.updatedAt = new Date();
  }

  resolvePrice(basePrice: number): number {
    return this.properties.priceOverride ?? basePrice;
  }

  resolveDuration(baseDurationMinutes: number): number {
    return this.properties.durationOverrideMinutes ?? baseDurationMinutes;
  }

  resolveDeposit(baseDepositAmount: number | null): number | null {
    return this.properties.depositOverride ?? baseDepositAmount;
  }

  get id(): string {
    return this.properties.id;
  }

  get staffId(): string {
    return this.properties.staffId;
  }

  get serviceId(): string {
    return this.properties.serviceId;
  }

  get priceOverride(): number | null {
    return this.properties.priceOverride;
  }

  get durationOverrideMinutes(): number | null {
    return this.properties.durationOverrideMinutes;
  }

  get depositOverride(): number | null {
    return this.properties.depositOverride;
  }

  get isActive(): boolean {
    return this.properties.isActive;
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }

  get updatedAt(): Date {
    return this.properties.updatedAt;
  }

  toProperties(): StaffServiceProperties {
    return { ...this.properties };
  }

  private static validateUuid(id: string, fieldName: string): string {
    const trimmed = id?.trim();
    if (!trimmed) {
      throw new InvalidStaffServiceError(`${fieldName} is required`);
    }
    return trimmed;
  }

  private static validatePriceOverride(
    price: number | null | undefined,
  ): number | null {
    if (price === null || price === undefined) return null;
    if (price < 0) {
      throw new InvalidStaffServiceError('Price override cannot be negative');
    }
    return price;
  }

  private static validateDurationOverride(
    minutes: number | null | undefined,
  ): number | null {
    if (minutes === null || minutes === undefined) return null;
    if (minutes <= 0) {
      throw new InvalidStaffServiceError(
        'Duration override must be greater than zero minutes',
      );
    }
    return minutes;
  }

  private static validateDepositOverride(
    deposit: number | null | undefined,
    priceOverride: number | null,
  ): number | null {
    if (deposit === null || deposit === undefined) return null;
    if (deposit < 0) {
      throw new InvalidStaffServiceError('Deposit override cannot be negative');
    }
    if (priceOverride !== null && deposit > priceOverride) {
      throw new InvalidStaffServiceError(
        'Deposit override cannot exceed price override',
      );
    }
    return deposit;
  }
}
