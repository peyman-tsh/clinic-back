import { Permission } from '../../domain/entities/permission';
import { PermissionAlreadyInUseError } from '../../domain/errors/role.errors';
import { CreatePermissionUseCase } from './create-permission.use-case';

describe('CreatePermissionUseCase', () => {
  const permissions = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByModuleAndName: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const ids = { generate: jest.fn() };

  const subject = new CreatePermissionUseCase(permissions as never, ids as never);

  beforeEach(() => {
    jest.clearAllMocks();
    ids.generate.mockReturnValue('perm_1');
  });

  it('creates a permission when the name is available', async () => {
    permissions.findByModuleAndName.mockResolvedValue(null);
    permissions.save.mockResolvedValue(undefined);

    const output = await subject.execute({
      name: 'Read',
      module: 'users',
      description: 'Read users',
    });

    expect(ids.generate).toHaveBeenCalledTimes(1);
    expect(permissions.findByModuleAndName).toHaveBeenCalledWith('users', 'read');
    expect(permissions.save).toHaveBeenCalledTimes(1);
    expect(output).toMatchObject({
      id: 'perm_1',
      name: 'read',
      module: 'users',
      description: 'Read users',
    });
    expect(output.createdAt).toBeInstanceOf(Date);
    expect(output.updatedAt).toBeInstanceOf(Date);
  });

  it('rejects a duplicate permission name in the same module', async () => {
    permissions.findByModuleAndName.mockResolvedValue(
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

    await expect(
      subject.execute({ name: 'Read', module: 'users' }),
    ).rejects.toBeInstanceOf(PermissionAlreadyInUseError);
    expect(permissions.save).not.toHaveBeenCalled();
  });

  it('propagates validation errors from the permission entity', async () => {
    await expect(
      subject.execute({ name: 'X', module: 'users' }),
    ).rejects.toThrow(
      'Permission name must contain between 2 and 100 characters',
    );
    expect(permissions.findByModuleAndName).not.toHaveBeenCalled();
    expect(permissions.save).not.toHaveBeenCalled();
  });
});