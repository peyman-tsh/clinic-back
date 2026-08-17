import { Role } from '../../domain/entities/role';
import { RoleNotFoundError } from '../../domain/errors/role.errors';
import { DeleteRoleUseCase } from './delete-role.use-case';

describe('DeleteRoleUseCase', () => {
  const roles = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const subject = new DeleteRoleUseCase(roles);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws RoleNotFoundError when the role is missing', async () => {
    roles.findById.mockResolvedValue(null);

    await expect(subject.execute('role_1')).rejects.toBeInstanceOf(
      RoleNotFoundError,
    );
    expect(roles.delete).not.toHaveBeenCalled();
  });

  it('deletes the role', async () => {
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
    roles.delete.mockResolvedValue(undefined);

    await subject.execute('role_1');

    expect(roles.delete).toHaveBeenCalledWith('role_1');
  });
});
