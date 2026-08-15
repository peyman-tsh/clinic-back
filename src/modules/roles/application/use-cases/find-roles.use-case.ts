import { Inject, Injectable } from '@nestjs/common';
import { ROLE_REPOSITORY } from '../../domain/repositories/role.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';
import { RoleOutput, toRoleOutput } from '../dto/role.dto';

@Injectable()
export class FindRolesUseCase {
  constructor(@Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository) {}

  async execute(): Promise<RoleOutput[]> {
    return (await this.roles.findAll()).map(toRoleOutput);
  }
}
