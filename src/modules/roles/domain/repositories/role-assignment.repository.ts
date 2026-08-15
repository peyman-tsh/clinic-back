import { Permission } from '../entities/permission';
import { Role } from '../entities/role';

export const ROLE_ASSIGNMENT_REPOSITORY = Symbol('ROLE_ASSIGNMENT_REPOSITORY');

export interface RoleAssignmentRepository {
  assignPermission(roleId: string, permissionId: string): Promise<void>;
  removePermission(roleId: string, permissionId: string): Promise<void>;
  findPermissions(roleId: string): Promise<Permission[]>;
  userExists(userId: string): Promise<boolean>;
  assignUser(roleId: string, userId: string): Promise<void>;
  removeUser(roleId: string, userId: string): Promise<void>;
  findRolesForUser(userId: string): Promise<Role[]>;
}
