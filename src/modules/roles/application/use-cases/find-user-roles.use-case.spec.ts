import { Role } from '../../domain/entities/role';
import { RoleUserNotFoundError } from '../../domain/errors/role.errors';
import { FindUserRolesUseCase } from './find-user-roles.use-case';

describe('FindUserRolesUseCase', () => {
  const assignments = {
    assignPermission: jest.fn(),
    removePermission: jest.fn(),
    findPermissions: jest.fn(),
    userExists: jest.fn(),
    assignUser: jest.fn(),
    removeUser: jest.fn(),
    findRolesForUser: jest.fn(),
  };

  const subject = new FindUserRolesUseCase(assignments);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws RoleUserNotFoundError when the user does not exist', async () => {
    assignments.userExists.mockResolvedValue(false);

    await expect(subject.execute('user_1')).rejects.toBeInstanceOf(
      RoleUserNotFoundError,
    );
    expect(assignments.findRolesForUser).not.toHaveBeenCalled();
  });

  it('returns roles for the user', async () => {
    assignments.userExists.mockResolvedValue(true);
    const role1 = Role.rehydrate({
      id: 'role_1',
      name: 'admin',
      description: null,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      deletedAt: null,
    });
    const role2 = Role.rehydrate({
      id: 'role_2',
      name: 'user',
      description: 'Standard user',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      deletedAt: null,
    });
    assignments.findRolesForUser.mockResolvedValue([role1, role2]);

    const output = await subject.execute('user_1');

    expect(assignments.userExists).toHaveBeenCalledWith('user_1');
    expect(assignments.findRolesForUser).toHaveBeenCalledWith('user_1');
    expect(output).toHaveLength(2);
    expect(output[0]).toMatchObject({ id: 'role_1', name: 'admin' });
    expect(output[1]).toMatchObject({ id: 'role_2', name: 'user' });
  });
});
