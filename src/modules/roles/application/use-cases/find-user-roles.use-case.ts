import { Inject, Injectable } from '@nestjs/common';
import { RoleUserNotFoundError } from '../../domain/errors/role.errors';
import { ROLE_ASSIGNMENT_REPOSITORY } from '../../domain/repositories/role-assignment.repository';
import type { RoleAssignmentRepository } from '../../domain/repositories/role-assignment.repository';
import { RoleOutput, toRoleOutput } from '../dto/role.dto';

@Injectable()
export class FindUserRolesUseCase {
  constructor(
    @Inject(ROLE_ASSIGNMENT_REPOSITORY)
    private readonly assignments: RoleAssignmentRepository,
  ) {}

  async execute(userId: string): Promise<RoleOutput[]> {
    if (!(await this.assignments.userExists(userId))) {
      throw new RoleUserNotFoundError(userId);
    }

    return (await this.assignments.findRolesForUser(userId)).map(toRoleOutput);
  }
}
