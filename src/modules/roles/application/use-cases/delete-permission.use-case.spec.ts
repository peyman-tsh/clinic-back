import { Permission } from '../../domain/entities/permission';
import { PermissionNotFoundError } from '../../domain/errors/role.errors';
import { DeletePermissionUseCase } from './delete-permission.use-case';

describe('DeletePermissionUseCase', () => {
  const permissions = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByModuleAndName: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const subject = new DeletePermissionUseCase(permissions);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws PermissionNotFoundError when the permission is missing', async () => {
    permissions.findById.mockResolvedValue(null);

    await expect(subject.execute('perm_1')).rejects.toBeInstanceOf(
      PermissionNotFoundError,
    );
    expect(permissions.delete).not.toHaveBeenCalled();
  });

  it('deletes the permission', async () => {
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
    permissions.delete.mockResolvedValue(undefined);

    await subject.execute('perm_1');

    expect(permissions.delete).toHaveBeenCalledWith('perm_1');
  });
});
