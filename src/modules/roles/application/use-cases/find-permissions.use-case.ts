import { Inject, Injectable } from '@nestjs/common';
import { PERMISSION_REPOSITORY } from '../../domain/repositories/permission.repository';
import type { PermissionRepository } from '../../domain/repositories/permission.repository';
import { PermissionOutput, toPermissionOutput } from '../dto/permission.dto';

@Injectable()
export class FindPermissionsUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissions: PermissionRepository,
  ) {}

  async execute(): Promise<PermissionOutput[]> {
    return (await this.permissions.findAll()).map(toPermissionOutput);
  }
}
