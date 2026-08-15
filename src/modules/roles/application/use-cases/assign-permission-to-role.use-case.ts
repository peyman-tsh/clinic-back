import { Inject, Injectable } from '@nestjs/common';
import {
  PermissionNotFoundError,
  RoleNotFoundError,
} from '../../domain/errors/role.errors';
import { PERMISSION_REPOSITORY } from '../../domain/repositories/permission.repository';
import type { PermissionRepository } from '../../domain/repositories/permission.repository';
import {
  ROLE_ASSIGNMENT_REPOSITORY,
} from '../../domain/repositories/role-assignment.repository';
import type { RoleAssignmentRepository } from '../../domain/repositories/role-assignment.repository';
import { ROLE_REPOSITORY } from '../../domain/repositories/role.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';

@Injectable()
export class AssignPermissionToRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissions: PermissionRepository,
    @Inject(ROLE_ASSIGNMENT_REPOSITORY)
    private readonly assignments: RoleAssignmentRepository,
  ) {}

  async execute(roleId: string, permissionId: string): Promise<void> {
    if (!(await this.roles.findById(roleId))) throw new RoleNotFoundError(roleId);
    if (!(await this.permissions.findById(permissionId))) {
      throw new PermissionNotFoundError(permissionId);
    }

    await this.assignments.assignPermission(roleId, permissionId);
  }
}
