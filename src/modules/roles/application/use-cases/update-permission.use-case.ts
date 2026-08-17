import { Inject, Injectable } from '@nestjs/common';
import {
  InvalidPermissionError,
  PermissionAlreadyInUseError,
  PermissionNotFoundError,
} from '../../domain/errors/role.errors';
import { PERMISSION_REPOSITORY } from '../../domain/repositories/permission.repository';
import type { PermissionRepository } from '../../domain/repositories/permission.repository';
import {
  PermissionOutput,
  toPermissionOutput,
  UpdatePermissionInput,
} from '../dto/permission.dto';

@Injectable()
export class UpdatePermissionUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissions: PermissionRepository,
  ) {}

  async execute(
    id: string,
    input: UpdatePermissionInput,
  ): Promise<PermissionOutput> {
    if (Object.values(input).every((value) => value === undefined)) {
      throw new InvalidPermissionError(
        'At least one permission field must be provided',
      );
    }

    const permission = await this.permissions.findById(id);
    if (!permission) throw new PermissionNotFoundError(id);

    permission.update(input);
    const matchingPermission = await this.permissions.findByModuleAndName(
      permission.module,
      permission.name,
    );
    if (matchingPermission && matchingPermission.id !== id) {
      throw new PermissionAlreadyInUseError(permission.module, permission.name);
    }

    await this.permissions.save(permission);
    return toPermissionOutput(permission);
  }
}
