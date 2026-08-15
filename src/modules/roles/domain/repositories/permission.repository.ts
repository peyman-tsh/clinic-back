import { Permission } from '../entities/permission';

export const PERMISSION_REPOSITORY = Symbol('PERMISSION_REPOSITORY');

export interface PermissionRepository {
  findAll(): Promise<Permission[]>;
  findById(id: string): Promise<Permission | null>;
  findByModuleAndName(module: string, name: string): Promise<Permission | null>;
  save(permission: Permission): Promise<void>;
  delete(id: string): Promise<void>;
}
