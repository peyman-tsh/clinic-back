import { Permission } from '../../domain/entities/permission';
import { Role } from '../../domain/entities/role';
import { RoleNotFoundError } from '../../domain/errors/role.errors';
import { FindRolePermissionsUseCase } from './find-role-permissions.use-case';

describe('FindRolePermissionsUseCase', () => {
  const roles = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
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

  const subject = new FindRolePermissionsUseCase(roles as never, assignments as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws RoleNotFoundError when the role is missing', async () => {
    roles.findById.mockResolvedValue(null);

    await expect(subject.execute('role_1')).rejects.toBeInstanceOf(
      RoleNotFoundError,
    );
    expect(assignments.findPermissions).not.toHaveBeenCalled();
  });

  it('returns permissions for the role', async () => {
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
    const perm1 = Permission.rehydrate({
      id: 'perm_1',
      name: 'read',
      module: 'users',
      description: null,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      deletedAt: null,
    });
    const perm2 = Permission.rehydrate({
      id: 'perm_2',
      name: 'write',
      module: 'users',
      description: 'Write users',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      deletedAt: null,
    });
    assignments.findPermissions.mockResolvedValue([perm1, perm2]);

    const output = await subject.execute('role_1');

    expect(assignments.findPermissions).toHaveBeenCalledWith('role_1');
    expect(output).toHaveLength(2);
    expect(output[0]).toMatchObject({ id: 'perm_1', name: 'read' });
    expect(output[1]).toMatchObject({ id: 'perm_2', name: 'write' });
  });
});