import { Permission } from '../../domain/entities/permission';

export interface CreatePermissionInput {
  name: string;
  module: string;
  description?: string | null;
}

export interface UpdatePermissionInput {
  name?: string;
  module?: string;
  description?: string | null;
}

export interface PermissionOutput {
  id: string;
  name: string;
  module: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const toPermissionOutput = (
  permission: Permission,
): PermissionOutput => {
  const { deletedAt: _, ...output } = permission.toProperties();
  return output;
};
