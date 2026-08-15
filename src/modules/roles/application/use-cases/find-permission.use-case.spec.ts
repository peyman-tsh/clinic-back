import { Permission } from '../../domain/entities/permission';
import { PermissionNotFoundError } from '../../domain/errors/role.errors';
import { FindPermissionUseCase } from './find-permission.use-case';

describe('FindPermissionUseCase', () => {
  const permissions = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByModuleAndName: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const subject = new FindPermissionUseCase(permissions as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the permission when it exists', async () => {
    const perm = Permission.rehydrate({
      id: 'perm_1',
      name: 'read',
      module: 'users',
      description: 'Read users',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      deletedAt: null,
    });
    permissions.findById.mockResolvedValue(perm);

    const output = await subject.execute('perm_1');

    expect(permissions.findById).toHaveBeenCalledWith('perm_1');
    expect(output).toEqual({
      id: 'perm_1',
      name: 'read',
      module: 'users',
      description: 'Read users',
      createdAt: perm.toProperties().createdAt,
      updatedAt: perm.toProperties().updatedAt,
    });
  });

  it('throws PermissionNotFoundError when the permission is missing', async () => {
    permissions.findById.mockResolvedValue(null);

    await expect(subject.execute('missing')).rejects.toBeInstanceOf(
      PermissionNotFoundError,
    );
  });
});