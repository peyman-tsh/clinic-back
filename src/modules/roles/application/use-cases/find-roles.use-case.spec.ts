import { Role } from '../../domain/entities/role';
import { FindRolesUseCase } from './find-roles.use-case';

describe('FindRolesUseCase', () => {
  const roles = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const subject = new FindRolesUseCase(roles);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all roles', async () => {
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
    roles.findAll.mockResolvedValue([role1, role2]);

    const output = await subject.execute();

    expect(roles.findAll).toHaveBeenCalledTimes(1);
    expect(output).toHaveLength(2);
    expect(output[0]).toMatchObject({ id: 'role_1', name: 'admin' });
    expect(output[1]).toMatchObject({ id: 'role_2', name: 'user' });
  });

  it('returns an empty array when no roles exist', async () => {
    roles.findAll.mockResolvedValue([]);

    const output = await subject.execute();

    expect(output).toEqual([]);
  });
});
