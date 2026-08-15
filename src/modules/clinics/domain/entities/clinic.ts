import { InvalidClinicError } from '../errors/clinic.errors';

export enum ClinicStatus {
  Active = 'active',
  Inactive = 'inactive',
  Suspended = 'suspended',
}

export interface ClinicProperties {
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

export interface CreateClinicProperties {
  id: string;
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

export interface UpdateClinicProperties {
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

export class Clinic {
  private constructor(private properties: ClinicProperties) {}

  static create(input: CreateClinicProperties): Clinic {
    const now = new Date();
    const name = Clinic.validateName(input.name);
    const slug = input.slug ? Clinic.validateSlug(input.slug) : Clinic.generateSlug(name);

    return new Clinic({
      id: input.id,
      name,
      slug,
      description: Clinic.normalizeOptionalText(input.description),
      logoUrl: Clinic.normalizeOptionalText(input.logoUrl),
      email: Clinic.normalizeEmail(input.email),
      phone: Clinic.normalizeOptionalText(input.phone),
      website: Clinic.normalizeOptionalText(input.website),
      timezone: input.timezone?.trim() || 'UTC',
      currency: input.currency?.trim().toUpperCase() || 'USD',
      status: Clinic.validateStatus(input.status ?? ClinicStatus.Active),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  static rehydrate(properties: ClinicProperties): Clinic {
    return new Clinic({ ...properties });
  }

  update(input: UpdateClinicProperties): void {
    if (input.name !== undefined) {
      this.properties.name = Clinic.validateName(input.name);
    }
    if (input.slug !== undefined) {
      this.properties.slug = Clinic.validateSlug(input.slug);
    }
    if (input.description !== undefined) {
      this.properties.description = Clinic.normalizeOptionalText(input.description);
    }
    if (input.logoUrl !== undefined) {
      this.properties.logoUrl = Clinic.normalizeOptionalText(input.logoUrl);
    }
    if (input.email !== undefined) {
      this.properties.email = Clinic.normalizeEmail(input.email);
    }
    if (input.phone !== undefined) {
      this.properties.phone = Clinic.normalizeOptionalText(input.phone);
    }
    if (input.website !== undefined) {
      this.properties.website = Clinic.normalizeOptionalText(input.website);
    }
    if (input.timezone !== undefined) {
      this.properties.timezone = input.timezone.trim() || 'UTC';
    }
    if (input.currency !== undefined) {
      this.properties.currency = input.currency.trim().toUpperCase() || 'USD';
    }
    if (input.status !== undefined) {
      this.properties.status = Clinic.validateStatus(input.status);
    }

    this.properties.updatedAt = new Date();
  }

  get id(): string {
    return this.properties.id;
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

  get logoUrl(): string | null {
    return this.properties.logoUrl;
  }

  get email(): string | null {
    return this.properties.email;
  }

  get phone(): string | null {
    return this.properties.phone;
  }

  get website(): string | null {
    return this.properties.website;
  }

  get timezone(): string {
    return this.properties.timezone;
  }

  get currency(): string {
    return this.properties.currency;
  }

  get status(): ClinicStatus {
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

  toProperties(): ClinicProperties {
    return { ...this.properties };
  }

  private static validateName(name: string): string {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new InvalidClinicError('Clinic name is required');
    }
    if (trimmed.length > 150) {
      throw new InvalidClinicError('Clinic name cannot exceed 150 characters');
    }
    return trimmed;
  }

  private static validateSlug(slug: string): string {
    const trimmed = slug.trim().toLowerCase();
    if (!trimmed) {
      throw new InvalidClinicError('Clinic slug is required');
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
      throw new InvalidClinicError('Clinic slug must be URL-friendly (lowercase letters, numbers, hyphens)');
    }
    if (trimmed.length > 150) {
      throw new InvalidClinicError('Clinic slug cannot exceed 150 characters');
    }
    return trimmed;
  }

  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'clinic';
  }

  private static normalizeEmail(email: string | null | undefined): string | null {
    if (email === null || email === undefined) return null;
    const normalized = email.trim().toLowerCase();
    if (!normalized) return null;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw new InvalidClinicError('A valid email address is required');
    }
    return normalized;
  }

  private static normalizeOptionalText(value: string | null | undefined): string | null {
    if (value === null || value === undefined) return null;
    return value.trim() || null;
  }

  private static validateStatus(status: ClinicStatus): ClinicStatus {
    if (!Object.values(ClinicStatus).includes(status)) {
      throw new InvalidClinicError('Clinic status is invalid');
    }
    return status;
  }
}
