import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Role, RoleProperties } from '../../domain/entities/role';
import { RoleNameAlreadyInUseError } from '../../domain/errors/role.errors';
import type { RoleRepository } from '../../domain/repositories/role.repository';
import { RoleOrmEntity } from './role.orm-entity';

@Injectable()
export class TypeOrmRoleRepository implements RoleRepository {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly roles: Repository<RoleOrmEntity>,
  ) {}

  async findAll(): Promise<Role[]> {
    const entities = await this.roles.find({
      order: { createdAt: 'DESC', id: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<Role | null> {
    const entity = await this.roles.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const entity = await this.roles
      .createQueryBuilder('role')
      .where('LOWER(role.name) = LOWER(:name)', { name })
      .getOne();
    return entity ? this.toDomain(entity) : null;
  }

  async save(role: Role): Promise<void> {
    try {
      await this.roles.save(this.roles.create(role.toProperties()));
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        throw new RoleNameAlreadyInUseError(role.name);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await this.roles.softDelete(id);
  }

  private toDomain(entity: RoleOrmEntity): Role {
    const properties: RoleProperties = {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
    return Role.rehydrate(properties);
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
