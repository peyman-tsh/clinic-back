import { Permission } from '../../domain/entities/permission';
import { Role } from '../../domain/entities/role';
import {
  PermissionNotFoundError,
  RoleNotFoundError,
} from '../../domain/errors/role.errors';
import { AssignPermissionToRoleUseCase } from './assign-permission-to-role.use-case';

describe('AssignPermissionToRoleUseCase', () => {
  const roles = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const permissions = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByModuleAndName: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const assignments = {
    assignPermission: jest.fn(),
    removePermission: jest.fn(),
    findPermissions: jest.fn(),
    userExists: jest.fn(),
    assignUser: jest.fn(),
    removeUser: jest.fn(),
    findRolesForUser: jest.fn(),
  };

  const subject = new AssignPermissionToRoleUseCase(
    roles as never,
    permissions as never,
    assignments as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws RoleNotFoundError when the role is missing', async () => {
    roles.findById.mockResolvedValue(null);

    await expect(
      subject.execute('role_1', 'perm_1'),
    ).rejects.toBeInstanceOf(RoleNotFoundError);
    expect(assignments.assignPermission).not.toHaveBeenCalled();
  });

  it('throws PermissionNotFoundError when the permission is missing', async () => {
    roles.findById.mockResolvedValue(
      Role.rehydrate({
        id: 'role_1',
        name: 'admin',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }),
    );
    permissions.findById.mockResolvedValue(null);

    await expect(
      subject.execute('role_1', 'perm_1'),
    ).rejects.toBeInstanceOf(PermissionNotFoundError);
    expect(assignments.assignPermission).not.toHaveBeenCalled();
  });

  it('assigns the permission to the role', async () => {
    roles.findById.mockResolvedValue(
      Role.rehydrate({
        id: 'role_1',
        name: 'admin',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }),
    );
    permissions.findById.mockResolvedValue(
      Permission.rehydrate({
        id: 'perm_1',
        name: 'read',
        module: 'users',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }),
    );
    assignments.assignPermission.mockResolvedValue(undefined);

    await subject.execute('role_1', 'perm_1');

    expect(assignments.assignPermission).toHaveBeenCalledWith('role_1', 'perm_1');
  });
});