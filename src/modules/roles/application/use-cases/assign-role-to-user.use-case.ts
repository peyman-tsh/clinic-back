import { Inject, Injectable } from '@nestjs/common';
import {
  RoleNotFoundError,
  RoleUserNotFoundError,
} from '../../domain/errors/role.errors';
import { ROLE_ASSIGNMENT_REPOSITORY } from '../../domain/repositories/role-assignment.repository';
import type { RoleAssignmentRepository } from '../../domain/repositories/role-assignment.repository';
import { ROLE_REPOSITORY } from '../../domain/repositories/role.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';

@Injectable()
export class AssignRoleToUserUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository,
    @Inject(ROLE_ASSIGNMENT_REPOSITORY)
    private readonly assignments: RoleAssignmentRepository,
  ) {}

  async execute(userId: string, roleId: string): Promise<void> {
    if (!(await this.roles.findById(roleId))) throw new RoleNotFoundError(roleId);
    if (!(await this.assignments.userExists(userId))) {
      throw new RoleUserNotFoundError(userId);
    }

    await this.assignments.assignUser(roleId, userId);
  }
}
