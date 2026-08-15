import { InvalidRoleError } from '../errors/role.errors';

export interface RoleProperties {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateRoleProperties {
  id: string;
  name: string;
  description?: string | null;
}

export interface UpdateRoleProperties {
  name?: string;
  description?: string | null;
}

export class Role {
  private constructor(private properties: RoleProperties) {}

  static create(input: CreateRoleProperties): Role {
    const now = new Date();

    return new Role({
      id: input.id,
      name: Role.normalizeName(input.name),
      description: Role.normalizeDescription(input.description),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  static rehydrate(properties: RoleProperties): Role {
    return new Role({ ...properties });
  }

  update(input: UpdateRoleProperties): void {
    if (input.name !== undefined) {
      this.properties.name = Role.normalizeName(input.name);
    }

    if (input.description !== undefined) {
      this.properties.description = Role.normalizeDescription(input.description);
    }

    this.properties.updatedAt = new Date();
  }

  archive(): void {
    if (this.properties.deletedAt !== null) return;

    const now = new Date();
    this.properties.deletedAt = now;
    this.properties.updatedAt = now;
  }

  get id(): string {
    return this.properties.id;
  }

  get name(): string {
    return this.properties.name;
  }

  toProperties(): RoleProperties {
    return { ...this.properties };
  }

  private static normalizeName(name: string): string {
    const normalized = name.trim();

    if (normalized.length < 2 || normalized.length > 100) {
      throw new InvalidRoleError('Role name must contain between 2 and 100 characters');
    }

    return normalized;
  }

  private static normalizeDescription(
    description: string | null | undefined,
  ): string | null {
    if (description === null || description === undefined) return null;

    const normalized = description.trim();

    if (!normalized) return null;

    if (normalized.length > 500) {
      throw new InvalidRoleError('Role description cannot exceed 500 characters');
    }

    return normalized;
  }
}
