import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Permission, PermissionProperties } from '../../domain/entities/permission';
import { PermissionAlreadyInUseError } from '../../domain/errors/role.errors';
import type { PermissionRepository } from '../../domain/repositories/permission.repository';
import { PermissionOrmEntity } from './permission.orm-entity';

@Injectable()
export class TypeOrmPermissionRepository implements PermissionRepository {
  constructor(
    @InjectRepository(PermissionOrmEntity)
    private readonly permissions: Repository<PermissionOrmEntity>,
  ) {}

  async findAll(): Promise<Permission[]> {
    const entities = await this.permissions.find({
      order: { module: 'ASC', name: 'ASC', id: 'ASC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<Permission | null> {
    const entity = await this.permissions.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findByModuleAndName(
    module: string,
    name: string,
  ): Promise<Permission | null> {
    const entity = await this.permissions
      .createQueryBuilder('permission')
      .where('LOWER(permission.module) = LOWER(:module)', { module })
      .andWhere('LOWER(permission.name) = LOWER(:name)', { name })
      .getOne();
    return entity ? this.toDomain(entity) : null;
  }

  async save(permission: Permission): Promise<void> {
    try {
      await this.permissions.save(
        this.permissions.create(permission.toProperties()),
      );
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        throw new PermissionAlreadyInUseError(permission.module, permission.name);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await this.permissions.softDelete(id);
  }

  private toDomain(entity: PermissionOrmEntity): Permission {
    const properties: PermissionProperties = {
      id: entity.id,
      name: entity.name,
      module: entity.module,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
    return Permission.rehydrate(properties);
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
}
