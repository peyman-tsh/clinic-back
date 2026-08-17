import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import {
  Permission,
  PermissionProperties,
} from '../../domain/entities/permission';
import { Role, RoleProperties } from '../../domain/entities/role';
import type { RoleAssignmentRepository } from '../../domain/repositories/role-assignment.repository';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { RolePermissionOrmEntity } from './role-permission.orm-entity';
import { UserRoleOrmEntity } from './user-role.orm-entity';

@Injectable()
export class TypeOrmRoleAssignmentRepository implements RoleAssignmentRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
    @InjectRepository(RolePermissionOrmEntity)
    private readonly rolePermissions: Repository<RolePermissionOrmEntity>,
    @InjectRepository(UserRoleOrmEntity)
    private readonly userRoles: Repository<UserRoleOrmEntity>,
  ) {}

  async assignPermission(roleId: string, permissionId: string): Promise<void> {
    await this.rolePermissions
      .createQueryBuilder()
      .insert()
      .into(RolePermissionOrmEntity)
      .values({ roleId, permissionId })
      .orIgnore()
      .execute();
  }

  async removePermission(roleId: string, permissionId: string): Promise<void> {
    await this.rolePermissions.delete({ roleId, permissionId });
  }

  async findPermissions(roleId: string): Promise<Permission[]> {
    const assignments = await this.rolePermissions.find({
      where: { roleId },
      relations: { permission: true },
      order: { permissionId: 'ASC' },
    });

    return assignments
      .filter((assignment) => assignment.permission !== undefined)
      .map((assignment) => this.toPermissionDomain(assignment.permission));
  }

  async userExists(userId: string): Promise<boolean> {
    return this.users.exists({ where: { id: userId } });
  }

  async assignUser(roleId: string, userId: string): Promise<void> {
    await this.userRoles
      .createQueryBuilder()
      .insert()
      .into(UserRoleOrmEntity)
      .values({ roleId, userId })
      .orIgnore()
      .execute();
  }

  async removeUser(roleId: string, userId: string): Promise<void> {
    await this.userRoles.delete({ roleId, userId });
  }

  async findRolesForUser(userId: string): Promise<Role[]> {
    const assignments = await this.userRoles.find({
      where: { userId },
      relations: { role: true },
      order: { roleId: 'ASC' },
    });

    return assignments
      .filter((assignment) => assignment.role !== undefined)
      .map((assignment) => this.toRoleDomain(assignment.role));
  }

  private toPermissionDomain(
    entity: RolePermissionOrmEntity['permission'],
  ): Permission {
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

  private toRoleDomain(entity: UserRoleOrmEntity['role']): Role {
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
}
