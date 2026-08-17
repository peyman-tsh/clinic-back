import { InvalidPermissionError } from '../errors/role.errors';

export interface PermissionProperties {
  id: string;
  name: string;
  module: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreatePermissionProperties {
  id: string;
  name: string;
  module: string;
  description?: string | null;
}

export interface UpdatePermissionProperties {
  name?: string;
  module?: string;
  description?: string | null;
}

export class Permission {
  private constructor(private properties: PermissionProperties) {}

  static create(input: CreatePermissionProperties): Permission {
    const now = new Date();

    return new Permission({
      id: input.id,
      name: Permission.normalizeName(input.name),
      module: Permission.normalizeModule(input.module),
      description: Permission.normalizeDescription(input.description),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  static rehydrate(properties: PermissionProperties): Permission {
    return new Permission({ ...properties });
  }

  update(input: UpdatePermissionProperties): void {
    if (input.name !== undefined) {
      this.properties.name = Permission.normalizeName(input.name);
    }

    if (input.module !== undefined) {
      this.properties.module = Permission.normalizeModule(input.module);
    }

    if (input.description !== undefined) {
      this.properties.description = Permission.normalizeDescription(
        input.description,
      );
    }

    this.properties.updatedAt = new Date();
  }

  get id(): string {
    return this.properties.id;
  }

  get name(): string {
    return this.properties.name;
  }

  get module(): string {
    return this.properties.module;
  }

  toProperties(): PermissionProperties {
    return { ...this.properties };
  }

  private static normalizeName(name: string): string {
    const normalized = name.trim().toLowerCase();

    if (normalized.length < 2 || normalized.length > 100) {
      throw new InvalidPermissionError(
        'Permission name must contain between 2 and 100 characters',
      );
    }

    return normalized;
  }

  private static normalizeModule(module: string): string {
    const normalized = module.trim().toLowerCase();

    if (normalized.length < 2 || normalized.length > 100) {
      throw new InvalidPermissionError(
        'Permission module must contain between 2 and 100 characters',
      );
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
      throw new InvalidPermissionError(
        'Permission description cannot exceed 500 characters',
      );
    }

    return normalized;
  }
}
