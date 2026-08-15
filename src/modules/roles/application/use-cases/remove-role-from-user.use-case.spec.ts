import { Role } from '../../domain/entities/role';
import {
  RoleNotFoundError,
  RoleUserNotFoundError,
} from '../../domain/errors/role.errors';
import { RemoveRoleFromUserUseCase } from './remove-role-from-user.use-case';

describe('RemoveRoleFromUserUseCase', () => {
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

  const subject = new RemoveRoleFromUserUseCase(
    roles as never,
    assignments as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws RoleNotFoundError when the role is missing', async () => {
    roles.findById.mockResolvedValue(null);

    await expect(
      subject.execute('user_1', 'role_1'),
    ).rejects.toBeInstanceOf(RoleNotFoundError);
    expect(assignments.removeUser).not.toHaveBeenCalled();
  });

  it('throws RoleUserNotFoundError when the user does not exist', async () => {
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
    assignments.userExists.mockResolvedValue(false);

    await expect(
      subject.execute('user_1', 'role_1'),
    ).rejects.toBeInstanceOf(RoleUserNotFoundError);
    expect(assignments.removeUser).not.toHaveBeenCalled();
  });

  it('removes the role from the user', async () => {
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
    assignments.userExists.mockResolvedValue(true);
    assignments.removeUser.mockResolvedValue(undefined);

    await subject.execute('user_1', 'role_1');

    expect(assignments.removeUser).toHaveBeenCalledWith('role_1', 'user_1');
  });
});