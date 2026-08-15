import { InvalidUserError } from '../errors/user.errors';

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Suspended = 'suspended',
}

export interface UserProperties {
  id: string;
  username: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  avatarUrl?: string | null;
  passwordHash: string;
  status: UserStatus;
  emailVerifiedAt?: Date | null;
  phoneVerifiedAt?: Date | null;
  departmentId: string | null;
  managerId: string | null;
  timezone: string;
  language: string;
  lastLoginAt: Date | null;
  passwordChangedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}


export interface RegisterUserProperties {
  id: string;
  username?: string;
  employeeCode?: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  passwordHash: string;
  phone?: string | null;
  avatar?: string | null;
  status?: UserStatus;
  departmentId?: string | null;
  managerId?: string | null;
  timezone?: string;
  language?: string;
  passwordChangedAt?: Date | null;
}

export interface UpdateUserProperties {
  username?: string;
  employeeCode?: string;
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  passwordHash?: string;
  status?: UserStatus;
  departmentId?: string | null;
  managerId?: string | null;
  timezone?: string;
  language?: string;
  lastLoginAt?: Date | null;
  passwordChangedAt?: Date | null;
}

export class User {
  private constructor(private properties: UserProperties) {}

  static register(input: RegisterUserProperties): User {
    const now = new Date();

    return new User({
      id: input.id,
      username: User.normalizeUsername(input.username, input.email, input.id),
      employeeCode: User.normalizeEmployeeCode(input.employeeCode, input.id),
      firstName: User.normalizeName(input.firstName, 'First name'),
      lastName: User.normalizeName(input.lastName, 'Last name'),
      email: User.normalizeEmail(input.email),
      phone: User.normalizeOptionalText(input.phone),
      avatar: User.normalizeOptionalText(input.avatar),
      passwordHash: User.validatePasswordHash(input.passwordHash),
      status: User.validateStatus(input.status ?? UserStatus.Active),
      departmentId: User.normalizeOptionalText(input.departmentId),
      managerId: User.normalizeOptionalText(input.managerId),
      timezone: User.normalizeName(input.timezone ?? 'UTC', 'Timezone'),
      language: User.normalizeName(input.language ?? 'en', 'Language'),
      lastLoginAt: null,
      passwordChangedAt: input.passwordChangedAt ?? null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  static rehydrate(properties: UserProperties): User {
    return new User({ ...properties });
  }

  static normalizeEmail(email: string | null | undefined): string | null {
    if (email === null || email === undefined) return null;
    const normalized = email.trim().toLowerCase();
    if (!normalized) return null;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw new InvalidUserError('A valid email is required when specified');
    }

    return normalized;
  }

  static normalizeUsername(
    username: string | undefined,
    email: string | null | undefined,
    id: string,
  ): string {
    if (username && username.trim()) {
      const normalized = username.trim();
      if (normalized.length < 2 || normalized.length > 100) {
        throw new InvalidUserError('Username must contain between 2 and 100 characters');
      }
      return normalized;
    }

    // Default fallback generator if not provided
    if (email && email.trim()) {
      const prefix = email.trim().split('@')[0];
      if (prefix && prefix.length >= 2) return prefix;
    }

    const shortId = id.replace(/-/g, '').substring(0, 8);
    return `user_${shortId}`;
  }

  static normalizeEmployeeCode(code: string | undefined, id: string): string {
    if (code && code.trim()) {
      const normalized = code.trim();
      if (normalized.length > 50) {
        throw new InvalidUserError('Employee code cannot exceed 50 characters');
      }
      return normalized;
    }

    const shortId = id.replace(/-/g, '').substring(0, 8).toUpperCase();
    return `EMP-${shortId}`;
  }

  update(input: UpdateUserProperties): void {
    if (input.username !== undefined) {
      this.properties.username = User.normalizeUsername(
        input.username,
        this.properties.email,
        this.properties.id,
      );
    }

    if (input.employeeCode !== undefined) {
      this.properties.employeeCode = User.normalizeEmployeeCode(
        input.employeeCode,
        this.properties.id,
      );
    }

    if (input.firstName !== undefined) {
      this.properties.firstName = User.normalizeName(input.firstName, 'First name');
    }

    if (input.lastName !== undefined) {
      this.properties.lastName = User.normalizeName(input.lastName, 'Last name');
    }

    if (input.email !== undefined) {
      this.properties.email = User.normalizeEmail(input.email);
    }

    if (input.phone !== undefined) this.properties.phone = User.normalizeOptionalText(input.phone);
    if (input.avatar !== undefined) this.properties.avatar = User.normalizeOptionalText(input.avatar);
    if (input.passwordHash !== undefined) {
      this.properties.passwordHash = User.validatePasswordHash(input.passwordHash);
      this.properties.passwordChangedAt = new Date();
    }
    if (input.status !== undefined) this.properties.status = User.validateStatus(input.status);
    if (input.departmentId !== undefined) {
      this.properties.departmentId = User.normalizeOptionalText(input.departmentId);
    }
    if (input.managerId !== undefined) {
      this.properties.managerId = User.normalizeOptionalText(input.managerId);
    }
    if (input.timezone !== undefined) {
      this.properties.timezone = User.normalizeName(input.timezone, 'Timezone');
    }
    if (input.language !== undefined) {
      this.properties.language = User.normalizeName(input.language, 'Language');
    }
    if (input.lastLoginAt !== undefined) this.properties.lastLoginAt = input.lastLoginAt;
    if (input.passwordChangedAt !== undefined) this.properties.passwordChangedAt = input.passwordChangedAt;

    this.properties.updatedAt = new Date();
  }

  get id(): string {
    return this.properties.id;
  }

  get username(): string {
    return this.properties.username;
  }

  get employeeCode(): string {
    return this.properties.employeeCode;
  }

  get email(): string | null {
    return this.properties.email;
  }

  get phone(): string | null {
    return this.properties.phone;
  }

  get firstName(): string {
    return this.properties.firstName;
  }

  get lastName(): string {
    return this.properties.lastName;
  }

  get avatarUrl(): string | null {
    return this.properties.avatarUrl ?? this.properties.avatar;
  }

  get status(): UserStatus {
    return this.properties.status;
  }

  get emailVerifiedAt(): Date | null {
    return this.properties.emailVerifiedAt ?? null;
  }

  get phoneVerifiedAt(): Date | null {
    return this.properties.phoneVerifiedAt ?? null;
  }

  get passwordHash(): string {
    return this.properties.passwordHash;
  }


  get passwordChangedAt(): Date | null {
    return this.properties.passwordChangedAt;
  }

  toProperties(): UserProperties {
    return { ...this.properties };
  }

  private static normalizeName(name: string, field: string): string {
    const normalized = name.trim();

    if (!normalized) {
      throw new InvalidUserError(`${field} is required`);
    }

    return normalized;
  }

  private static normalizeOptionalText(value: string | null | undefined): string | null {
    if (value === null || value === undefined) return null;
    return value.trim() || null;
  }

  private static validatePasswordHash(passwordHash: string): string {
    if (!passwordHash) {
      throw new InvalidUserError('Password hash is required');
    }

    return passwordHash;
  }

  private static validateStatus(status: UserStatus): UserStatus {
    if (!Object.values(UserStatus).includes(status)) {
      throw new InvalidUserError('User status is invalid');
    }

    return status;
  }
}
