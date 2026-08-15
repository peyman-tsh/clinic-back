import { Role } from '../../domain/entities/role';

export interface CreateRoleInput {
  name: string;
  description?: string | null;
}

export interface UpdateRoleInput {
  name?: string;
  description?: string | null;
}

export interface RoleOutput {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const toRoleOutput = (role: Role): RoleOutput => {
  const { deletedAt: _, ...output } = role.toProperties();
  return output;
};
