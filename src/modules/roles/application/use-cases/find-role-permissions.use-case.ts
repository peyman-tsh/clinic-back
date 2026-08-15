import { Inject, Injectable } from '@nestjs/common';
import { RoleNotFoundError } from '../../domain/errors/role.errors';
import { ROLE_ASSIGNMENT_REPOSITORY } from '../../domain/repositories/role-assignment.repository';
import type { RoleAssignmentRepository } from '../../domain/repositories/role-assignment.repository';
import { ROLE_REPOSITORY } from '../../domain/repositories/role.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';
import { PermissionOutput, toPermissionOutput } from '../dto/permission.dto';

@Injectable()
export class FindRolePermissionsUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository,
    @Inject(ROLE_ASSIGNMENT_REPOSITORY)
    private readonly assignments: RoleAssignmentRepository,
  ) {}

  async execute(roleId: string): Promise<PermissionOutput[]> {
    if (!(await this.roles.findById(roleId))) throw new RoleNotFoundError(roleId);
    return (await this.assignments.findPermissions(roleId)).map(toPermissionOutput);
  }
}
