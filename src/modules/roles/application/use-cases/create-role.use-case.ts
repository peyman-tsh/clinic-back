import { Inject, Injectable } from '@nestjs/common';
import { Role } from '../../domain/entities/role';
import { RoleNameAlreadyInUseError } from '../../domain/errors/role.errors';
import { ROLE_REPOSITORY } from '../../domain/repositories/role.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';
import { CreateRoleInput, RoleOutput, toRoleOutput } from '../dto/role.dto';
import { ROLE_ID_GENERATOR } from '../ports/role-id-generator';
import type { RoleIdGenerator } from '../ports/role-id-generator';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository,
    @Inject(ROLE_ID_GENERATOR) private readonly ids: RoleIdGenerator,
  ) {}

  async execute(input: CreateRoleInput): Promise<RoleOutput> {
    const role = Role.create({ ...input, id: this.ids.generate() });

    if (await this.roles.findByName(role.name)) {
      throw new RoleNameAlreadyInUseError(role.name);
    }

    await this.roles.save(role);
    return toRoleOutput(role);
  }
}
