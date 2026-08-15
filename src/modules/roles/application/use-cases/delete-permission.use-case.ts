import { Inject, Injectable } from '@nestjs/common';
import { PermissionNotFoundError } from '../../domain/errors/role.errors';
import { PERMISSION_REPOSITORY } from '../../domain/repositories/permission.repository';
import type { PermissionRepository } from '../../domain/repositories/permission.repository';

@Injectable()
export class DeletePermissionUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissions: PermissionRepository,
  ) {}

  async execute(id: string): Promise<void> {
    if (!(await this.permissions.findById(id))) {
      throw new PermissionNotFoundError(id);
    }

    await this.permissions.delete(id);
  }
}
