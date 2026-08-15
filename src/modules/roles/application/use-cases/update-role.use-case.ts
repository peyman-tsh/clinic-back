import { Inject, Injectable } from '@nestjs/common';
import {
  InvalidRoleError,
  RoleNameAlreadyInUseError,
  RoleNotFoundError,
} from '../../domain/errors/role.errors';
import { ROLE_REPOSITORY } from '../../domain/repositories/role.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';
import { RoleOutput, toRoleOutput, UpdateRoleInput } from '../dto/role.dto';

@Injectable()
export class UpdateRoleUseCase {
  constructor(@Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository) {}

  async execute(id: string, input: UpdateRoleInput): Promise<RoleOutput> {
    if (Object.values(input).every((value) => value === undefined)) {
      throw new InvalidRoleError('At least one role field must be provided');
    }

    const role = await this.roles.findById(id);
    if (!role) throw new RoleNotFoundError(id);

    role.update(input);

    const matchingRole = await this.roles.findByName(role.name);
    if (matchingRole && matchingRole.id !== id) {
      throw new RoleNameAlreadyInUseError(role.name);
    }

    await this.roles.save(role);
    return toRoleOutput(role);
  }
}
