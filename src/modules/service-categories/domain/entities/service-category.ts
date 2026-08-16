import { InvalidServiceCategoryError } from '../errors/service-category.errors';

export interface ServiceCategoryProperties {
  id: string;
  clinicId: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateServiceCategoryProperties {
  id: string;
  clinicId: string;
  name: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateServiceCategoryProperties {
  name?: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export class ServiceCategory {
  private constructor(private properties: ServiceCategoryProperties) {}

  static create(input: CreateServiceCategoryProperties): ServiceCategory {
    const now = new Date();

    const name = ServiceCategory.validateName(input.name);
    const rawSlug = input.slug?.trim() || name;
    const slug = ServiceCategory.validateSlug(rawSlug);

    return new ServiceCategory({
      id: ServiceCategory.validateUuid(input.id, 'ID'),
      clinicId: ServiceCategory.validateUuid(input.clinicId, 'Clinic ID'),
      name,
      slug,
      description: ServiceCategory.normalizeOptionalText(input.description),
      imageUrl: ServiceCategory.normalizeOptionalText(input.imageUrl),
      sortOrder: input.sortOrder ?? 0,
      isActive: input.isActive ?? true,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  static rehydrate(properties: ServiceCategoryProperties): ServiceCategory {
    return new ServiceCategory({ ...properties });
  }

  update(input: UpdateServiceCategoryProperties): void {
    if (input.name !== undefined) {
      this.properties.name = ServiceCategory.validateName(input.name);
    }
    if (input.slug !== undefined || input.name !== undefined) {
      const rawSlug = input.slug?.trim() || this.properties.name;
      this.properties.slug = ServiceCategory.validateSlug(rawSlug);
    }
    if (input.description !== undefined) {
      this.properties.description = ServiceCategory.normalizeOptionalText(input.description);
    }
    if (input.imageUrl !== undefined) {
      this.properties.imageUrl = ServiceCategory.normalizeOptionalText(input.imageUrl);
    }
    if (input.sortOrder !== undefined) {
      this.properties.sortOrder = input.sortOrder;
    }
    if (input.isActive !== undefined) {
      this.properties.isActive = input.isActive;
    }

    this.properties.updatedAt = new Date();
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

  get slug(): string {
    return this.properties.slug;
  }

  get description(): string | null {
    return this.properties.description;
  }

  get imageUrl(): string | null {
    return this.properties.imageUrl;
  }

  get sortOrder(): number {
    return this.properties.sortOrder;
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

  get deletedAt(): Date | null {
    return this.properties.deletedAt;
  }

  toProperties(): ServiceCategoryProperties {
    return { ...this.properties };
  }

  private static validateUuid(id: string, fieldName: string): string {
    const trimmed = id?.trim();
    if (!trimmed) {
      throw new InvalidServiceCategoryError(`${fieldName} is required`);
    }
    return trimmed;
  }

  private static validateName(name: string): string {
    const trimmed = name?.trim();
    if (!trimmed) {
      throw new InvalidServiceCategoryError('Category name is required');
    }
    if (trimmed.length > 150) {
      throw new InvalidServiceCategoryError('Category name cannot exceed 150 characters');
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
      throw new InvalidServiceCategoryError('Category slug is invalid');
    }
    if (slugified.length > 150) {
      throw new InvalidServiceCategoryError('Category slug cannot exceed 150 characters');
    }
    return slugified;
  }

  private static normalizeOptionalText(value: string | null | undefined): string | null {
    if (value === null || value === undefined) return null;
    return value.trim() || null;
  }
}
