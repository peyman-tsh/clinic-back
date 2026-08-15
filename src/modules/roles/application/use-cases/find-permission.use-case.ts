import { Inject, Injectable } from '@nestjs/common';
import { PermissionNotFoundError } from '../../domain/errors/role.errors';
import { PERMISSION_REPOSITORY } from '../../domain/repositories/permission.repository';
import type { PermissionRepository } from '../../domain/repositories/permission.repository';
import { PermissionOutput, toPermissionOutput } from '../dto/permission.dto';

@Injectable()
export class FindPermissionUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissions: PermissionRepository,
  ) {}

  async execute(id: string): Promise<PermissionOutput> {
    const permission = await this.permissions.findById(id);
    if (!permission) throw new PermissionNotFoundError(id);
    return toPermissionOutput(permission);
  }
}
