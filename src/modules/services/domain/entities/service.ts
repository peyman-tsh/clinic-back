import { InvalidServiceError } from '../errors/service.errors';

export interface ServiceProperties {
  id: string;
  clinicId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  price: number;
  depositAmount: number | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateServiceProperties {
  id: string;
  clinicId: string;
  categoryId: string;
  name: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
  durationMinutes: number;
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
  price: number;
  depositAmount?: number | null;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateServiceProperties {
  categoryId?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
  durationMinutes?: number;
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
  price?: number;
  depositAmount?: number | null;
  isActive?: boolean;
  sortOrder?: number;
}

export class Service {
  private constructor(private properties: ServiceProperties) {}

  static create(input: CreateServiceProperties): Service {
    const now = new Date();

    const name = Service.validateName(input.name);
    const rawSlug = input.slug?.trim() || name;
    const slug = Service.validateSlug(rawSlug);
    const price = Service.validatePrice(input.price);
    const depositAmount = Service.validateDepositAmount(input.depositAmount, price);

    return new Service({
      id: Service.validateUuid(input.id, 'ID'),
      clinicId: Service.validateUuid(input.clinicId, 'Clinic ID'),
      categoryId: Service.validateUuid(input.categoryId, 'Category ID'),
      name,
      slug,
      description: Service.normalizeOptionalText(input.description),
      imageUrl: Service.normalizeOptionalText(input.imageUrl),
      durationMinutes: Service.validateDuration(input.durationMinutes, 'Duration'),
      bufferBeforeMinutes: Service.validateNonNegative(input.bufferBeforeMinutes ?? 0, 'Buffer before'),
      bufferAfterMinutes: Service.validateNonNegative(input.bufferAfterMinutes ?? 0, 'Buffer after'),
      price,
      depositAmount,
      isActive: input.isActive ?? true,
      sortOrder: input.sortOrder ?? 0,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  static rehydrate(properties: ServiceProperties): Service {
    return new Service({ ...properties });
  }

  update(input: UpdateServiceProperties): void {
    if (input.categoryId !== undefined) {
      this.properties.categoryId = Service.validateUuid(input.categoryId, 'Category ID');
    }
    if (input.name !== undefined) {
      this.properties.name = Service.validateName(input.name);
    }
    if (input.slug !== undefined || input.name !== undefined) {
      const rawSlug = input.slug?.trim() || this.properties.name;
      this.properties.slug = Service.validateSlug(rawSlug);
    }
    if (input.description !== undefined) {
      this.properties.description = Service.normalizeOptionalText(input.description);
    }
    if (input.imageUrl !== undefined) {
      this.properties.imageUrl = Service.normalizeOptionalText(input.imageUrl);
    }
    if (input.durationMinutes !== undefined) {
      this.properties.durationMinutes = Service.validateDuration(input.durationMinutes, 'Duration');
    }
    if (input.bufferBeforeMinutes !== undefined) {
      this.properties.bufferBeforeMinutes = Service.validateNonNegative(input.bufferBeforeMinutes, 'Buffer before');
    }
    if (input.bufferAfterMinutes !== undefined) {
      this.properties.bufferAfterMinutes = Service.validateNonNegative(input.bufferAfterMinutes, 'Buffer after');
    }
    if (input.price !== undefined) {
      this.properties.price = Service.validatePrice(input.price);
    }
    if (input.depositAmount !== undefined || input.price !== undefined) {
      const currentDeposit = input.depositAmount !== undefined ? input.depositAmount : this.properties.depositAmount;
      this.properties.depositAmount = Service.validateDepositAmount(currentDeposit, this.properties.price);
    }
    if (input.sortOrder !== undefined) {
      this.properties.sortOrder = input.sortOrder;
    }
    if (input.isActive !== undefined) {
      this.properties.isActive = input.isActive;
    }

    this.properties.updatedAt = new Date();
  }

  get totalOccupiedMinutes(): number {
    return this.properties.bufferBeforeMinutes + this.properties.durationMinutes + this.properties.bufferAfterMinutes;
  }

  get id(): string {
    return this.properties.id;
  }

  get clinicId(): string {
    return this.properties.clinicId;
  }

  get categoryId(): string {
    return this.properties.categoryId;
  }

  get name(): string {
    return this.properties.name;
  }

  get slug(): string {
    return this.properties.slug;
  }

  get description(): string | null {
    return this.properties.description;
  }

  get imageUrl(): string | null {
    return this.properties.imageUrl;
  }

  get durationMinutes(): number {
    return this.properties.durationMinutes;
  }

  get bufferBeforeMinutes(): number {
    return this.properties.bufferBeforeMinutes;
  }

  get bufferAfterMinutes(): number {
    return this.properties.bufferAfterMinutes;
  }

  get price(): number {
    return this.properties.price;
  }

  get depositAmount(): number | null {
    return this.properties.depositAmount;
  }

  get isActive(): boolean {
    return this.properties.isActive;
  }

  get sortOrder(): number {
    return this.properties.sortOrder;
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

  toProperties(): ServiceProperties {
    return { ...this.properties };
  }

  private static validateUuid(id: string, fieldName: string): string {
    const trimmed = id?.trim();
    if (!trimmed) {
      throw new InvalidServiceError(`${fieldName} is required`);
    }
    return trimmed;
  }

  private static validateName(name: string): string {
    const trimmed = name?.trim();
    if (!trimmed) {
      throw new InvalidServiceError('Service name is required');
    }
    if (trimmed.length > 150) {
      throw new InvalidServiceError('Service name cannot exceed 150 characters');
    }
    return trimmed;
  }

  private static validateSlug(slug: string): string {
    const slugified = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!slugified) {
      throw new InvalidServiceError('Service slug is invalid');
    }
    if (slugified.length > 150) {
      throw new InvalidServiceError('Service slug cannot exceed 150 characters');
    }
    return slugified;
  }

  private static validateDuration(minutes: number, fieldName: string): number {
    if (minutes === undefined || minutes === null || minutes <= 0) {
      throw new InvalidServiceError(`${fieldName} must be a positive integer greater than zero`);
    }
    return minutes;
  }

  private static validateNonNegative(value: number, fieldName: string): number {
    if (value === undefined || value === null || value < 0) {
      throw new InvalidServiceError(`${fieldName} cannot be negative`);
    }
    return value;
  }

  private static validatePrice(price: number): number {
    if (price === undefined || price === null || price < 0) {
      throw new InvalidServiceError('Price cannot be negative');
    }
    return price;
  }

  private static validateDepositAmount(deposit: number | null | undefined, price: number): number | null {
    if (deposit === null || deposit === undefined) return null;
    if (deposit < 0) {
      throw new InvalidServiceError('Deposit amount cannot be negative');
    }
    if (deposit > price) {
      throw new InvalidServiceError('Deposit amount cannot exceed service price');
    }
    return deposit;
  }

  private static normalizeOptionalText(value: string | null | undefined): string | null {
    if (value === null || value === undefined) return null;
    return value.trim() || null;
  }
}
