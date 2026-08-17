import { Permission } from '../../domain/entities/permission';
import {
  InvalidPermissionError,
  PermissionAlreadyInUseError,
  PermissionNotFoundError,
} from '../../domain/errors/role.errors';
import { UpdatePermissionUseCase } from './update-permission.use-case';

describe('UpdatePermissionUseCase', () => {
  const permissions = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByModuleAndName: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const subject = new UpdatePermissionUseCase(permissions);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects an empty update payload', async () => {
    await expect(subject.execute('perm_1', {})).rejects.toBeInstanceOf(
      InvalidPermissionError,
    );
    expect(permissions.findById).not.toHaveBeenCalled();
  });

  it('throws PermissionNotFoundError when the permission is missing', async () => {
    permissions.findById.mockResolvedValue(null);

    await expect(
      subject.execute('missing', { description: 'New' }),
    ).rejects.toBeInstanceOf(PermissionNotFoundError);
  });

  it('updates the permission and saves it', async () => {
    const perm = Permission.rehydrate({
      id: 'perm_1',
      name: 'read',
      module: 'users',
      description: 'Old',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      deletedAt: null,
    });
    permissions.findById.mockResolvedValue(perm);
    permissions.findByModuleAndName.mockResolvedValue(null);
    permissions.save.mockResolvedValue(undefined);

    const output = await subject.execute('perm_1', { description: 'New' });

    expect(permissions.findByModuleAndName).toHaveBeenCalledWith(
      'users',
      'read',
    );
    expect(permissions.save).toHaveBeenCalledWith(perm);
    expect(output).toMatchObject({
      id: 'perm_1',
      name: 'read',
      module: 'users',
      description: 'New',
    });
  });

  it('throws PermissionAlreadyInUseError when another permission has the same name/module', async () => {
    const perm = Permission.rehydrate({
      id: 'perm_1',
      name: 'read',
      module: 'users',
      description: null,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      deletedAt: null,
    });
    const other = Permission.rehydrate({
      id: 'perm_2',
      name: 'read',
      module: 'users',
      description: null,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      deletedAt: null,
    });
    permissions.findById.mockResolvedValue(perm);
    permissions.findByModuleAndName.mockResolvedValue(other);

    await expect(
      subject.execute('perm_1', { description: 'x' }),
    ).rejects.toBeInstanceOf(PermissionAlreadyInUseError);
    expect(permissions.save).not.toHaveBeenCalled();
  });
});
