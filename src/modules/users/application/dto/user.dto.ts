import { User, UserStatus } from '../../domain/entities/user';

export interface CreateUserInput {
  username?: string;
  employeeCode?: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  password: string;
  phone?: string | null;
  avatar?: string | null;
  status?: UserStatus;
  departmentId?: string | null;
  managerId?: string | null;
  timezone?: string;
  language?: string;
}

export interface UpdateUserInput {
  username?: string;
  employeeCode?: string;
  firstName?: string;
  lastName?: string;
  email?: string | null;
  password?: string;
  phone?: string | null;
  avatar?: string | null;
  status?: UserStatus;
  departmentId?: string | null;
  managerId?: string | null;
  timezone?: string;
  language?: string;
}

export interface UserOutput {
  id: string;
  username: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  status: UserStatus;
  departmentId: string | null;
  managerId: string | null;
  timezone: string;
  language: string;
  lastLoginAt: Date | null;
  passwordChangedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const toUserOutput = (user: User): UserOutput => {
  const { passwordHash: _, deletedAt: __, ...output } = user.toProperties();
  return output;
};
