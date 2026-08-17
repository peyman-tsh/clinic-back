import { Role } from '../../domain/entities/role';
import { RoleNameAlreadyInUseError } from '../../domain/errors/role.errors';
import { CreateRoleUseCase } from './create-role.use-case';

describe('CreateRoleUseCase', () => {
  const roles = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const ids = { generate: jest.fn() };

  const subject = new CreateRoleUseCase(roles, ids);

  beforeEach(() => {
    jest.clearAllMocks();
    ids.generate.mockReturnValue('role_1');
  });

  it('creates a role when the name is available', async () => {
    roles.findByName.mockResolvedValue(null);
    roles.save.mockResolvedValue(undefined);

    const output = await subject.execute({
      name: 'Admin',
      description: 'Full access',
    });

    expect(ids.generate).toHaveBeenCalledTimes(1);
    expect(roles.findByName).toHaveBeenCalledWith('Admin');
    expect(roles.save).toHaveBeenCalledTimes(1);
    expect(output).toMatchObject({
      id: 'role_1',
      name: 'Admin',
      description: 'Full access',
    });
    expect(output.createdAt).toBeInstanceOf(Date);
    expect(output.updatedAt).toBeInstanceOf(Date);
  });

  it('rejects a duplicate role name', async () => {
    roles.findByName.mockResolvedValue(
      Role.rehydrate({
        id: 'role_1',
        name: 'Admin',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }),
    );

    await expect(subject.execute({ name: 'Admin' })).rejects.toBeInstanceOf(
      RoleNameAlreadyInUseError,
    );
    expect(roles.save).not.toHaveBeenCalled();
  });

  it('propagates validation errors from the role entity', async () => {
    await expect(subject.execute({ name: 'A' })).rejects.toThrow(
      'Role name must contain between 2 and 100 characters',
    );
    expect(roles.findByName).not.toHaveBeenCalled();
    expect(roles.save).not.toHaveBeenCalled();
  });
});
