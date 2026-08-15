import { Inject, Injectable } from '@nestjs/common';
import { Permission } from '../../domain/entities/permission';
import { PermissionAlreadyInUseError } from '../../domain/errors/role.errors';
import { PERMISSION_REPOSITORY } from '../../domain/repositories/permission.repository';
import type { PermissionRepository } from '../../domain/repositories/permission.repository';
import {
  CreatePermissionInput,
  PermissionOutput,
  toPermissionOutput,
} from '../dto/permission.dto';
import { ROLE_ID_GENERATOR } from '../ports/role-id-generator';
import type { RoleIdGenerator } from '../ports/role-id-generator';

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissions: PermissionRepository,
    @Inject(ROLE_ID_GENERATOR) private readonly ids: RoleIdGenerator,
  ) {}

  async execute(input: CreatePermissionInput): Promise<PermissionOutput> {
    const permission = Permission.create({ ...input, id: this.ids.generate() });

    if (
      await this.permissions.findByModuleAndName(
        permission.module,
        permission.name,
      )
    ) {
      throw new PermissionAlreadyInUseError(permission.module, permission.name);
    }

    await this.permissions.save(permission);
    return toPermissionOutput(permission);
  }
}
