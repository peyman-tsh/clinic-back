import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { User, UserProperties } from '../../domain/entities/user';
import {
  EmailAlreadyInUseError,
  EmployeeCodeAlreadyInUseError,
  UsernameAlreadyInUseError,
} from '../../domain/errors/user.errors';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { UserOrmEntity } from './user.orm-entity';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    const entities = await this.users.find({
      order: { createdAt: 'DESC', id: 'DESC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.users.findOneBy({ email });
    return entity ? this.toDomain(entity) : null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const entity = await this.users.findOneBy({ phone });
    return entity ? this.toDomain(entity) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const entity = await this.users.findOneBy({ email: username });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmployeeCode(_employeeCode: string): Promise<User | null> {
    return null;
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.users.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async save(user: User): Promise<void> {
    try {
      await this.users.save(this.toEntity(user));
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        const detail = this.getUniqueErrorDetail(error);
        if (detail.includes('phone')) {
          throw new EmailAlreadyInUseError(user.phone ?? 'Phone already in use');
        }
        if (user.email && detail.includes('email')) {
          throw new EmailAlreadyInUseError(user.email);
        }
        if (user.email) {
          throw new EmailAlreadyInUseError(user.email);
        }
        throw new UsernameAlreadyInUseError(user.username);
      }

      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await this.users.softDelete(id);
  }

  private toDomain(entity: UserOrmEntity): User {
    const properties: UserProperties = {
      id: entity.id,
      username: entity.email ? entity.email.split('@')[0] : `user_${entity.id.slice(0, 8)}`,
      employeeCode: `EMP-${entity.id.slice(0, 8).toUpperCase()}`,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      phone: entity.phone,
      avatar: entity.avatarUrl,
      avatarUrl: entity.avatarUrl,
      passwordHash: entity.passwordHash,
      status: entity.status,
      emailVerifiedAt: entity.emailVerifiedAt,
      phoneVerifiedAt: entity.phoneVerifiedAt,
      departmentId: null,
      managerId: null,
      timezone: 'UTC',
      language: 'en',
      lastLoginAt: entity.lastLoginAt,
      passwordChangedAt: null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };

    return User.rehydrate(properties);
  }

  private toEntity(user: User): UserOrmEntity {
    const props = user.toProperties();
    const entity = new UserOrmEntity();
    entity.id = props.id;
    entity.firstName = props.firstName;
    entity.lastName = props.lastName;
    entity.email = props.email;
    entity.phone = props.phone;
    entity.passwordHash = props.passwordHash;
    entity.avatarUrl = props.avatarUrl ?? props.avatar ?? null;
    entity.status = props.status;
    entity.emailVerifiedAt = props.emailVerifiedAt ?? null;
    entity.phoneVerifiedAt = props.phoneVerifiedAt ?? null;
    entity.lastLoginAt = props.lastLoginAt;
    entity.createdAt = props.createdAt;
    entity.updatedAt = props.updatedAt;
    entity.deletedAt = props.deletedAt;
    return entity;
  }

  private isUniqueViolation(error: unknown): boolean {
    if (typeof error !== 'object' || error === null || !('driverError' in error)) {
      return false;
    }

    const { driverError } = error;
    return (
      typeof driverError === 'object' &&
      driverError !== null &&
      'code' in driverError &&
      driverError.code === '23505'
    );
  }

  private getUniqueErrorDetail(error: unknown): string {
    if (typeof error !== 'object' || error === null || !('driverError' in error)) {
      return '';
    }
    const { driverError } = error as { driverError: unknown };
    if (
      typeof driverError === 'object' &&
      driverError !== null &&
      'detail' in driverError &&
      typeof driverError.detail === 'string'
    ) {
      return driverError.detail;
    }
    return '';
  }
}
