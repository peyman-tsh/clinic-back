import { Role } from '../../domain/entities/role';
import { RoleNotFoundError } from '../../domain/errors/role.errors';
import { FindRoleUseCase } from './find-role.use-case';

describe('FindRoleUseCase', () => {
  const roles = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const subject = new FindRoleUseCase(roles);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the role when it exists', async () => {
    const role = Role.rehydrate({
      id: 'role_1',
      name: 'admin',
      description: 'Administrator',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      deletedAt: null,
    });
    roles.findById.mockResolvedValue(role);

    const output = await subject.execute('role_1');

    expect(roles.findById).toHaveBeenCalledWith('role_1');
    expect(output).toMatchObject({
      id: 'role_1',
      name: 'admin',
      description: 'Administrator',
    });
  });

  it('throws RoleNotFoundError when the role is missing', async () => {
    roles.findById.mockResolvedValue(null);

    await expect(subject.execute('missing')).rejects.toBeInstanceOf(
      RoleNotFoundError,
    );
  });
});
