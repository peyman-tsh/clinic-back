import { Inject, Injectable } from '@nestjs/common';
import { RoleNotFoundError } from '../../domain/errors/role.errors';
import { ROLE_REPOSITORY } from '../../domain/repositories/role.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';
import { RoleOutput, toRoleOutput } from '../dto/role.dto';

@Injectable()
export class FindRoleUseCase {
  constructor(@Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository) {}

  async execute(id: string): Promise<RoleOutput> {
    const role = await this.roles.findById(id);
    if (!role) throw new RoleNotFoundError(id);
    return toRoleOutput(role);
  }
}
