import { Inject, Injectable } from '@nestjs/common';
import { RoleNotFoundError } from '../../domain/errors/role.errors';
import { ROLE_REPOSITORY } from '../../domain/repositories/role.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';

@Injectable()
export class DeleteRoleUseCase {
  constructor(@Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository) {}

  async execute(id: string): Promise<void> {
    if (!(await this.roles.findById(id))) throw new RoleNotFoundError(id);
    await this.roles.delete(id);
  }
}
