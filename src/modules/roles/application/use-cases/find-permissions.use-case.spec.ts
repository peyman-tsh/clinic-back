import { Permission } from '../../domain/entities/permission';
import { FindPermissionsUseCase } from './find-permissions.use-case';

describe('FindPermissionsUseCase', () => {
  const permissions = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByModuleAndName: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const subject = new FindPermissionsUseCase(permissions as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all permissions', async () => {
    const perm1 = Permission.rehydrate({
      id: 'perm_1',
      name: 'read',
      module: 'users',
      description: null,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      deletedAt: null,
    });
    const perm2 = Permission.rehydrate({
      id: 'perm_2',
      name: 'write',
      module: 'users',
      description: 'Write users',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      deletedAt: null,
    });
    permissions.findAll.mockResolvedValue([perm1, perm2]);

    const output = await subject.execute();

    expect(permissions.findAll).toHaveBeenCalledTimes(1);
    expect(output).toHaveLength(2);
    expect(output[0]).toMatchObject({ id: 'perm_1', name: 'read', module: 'users' });
    expect(output[1]).toMatchObject({ id: 'perm_2', name: 'write', module: 'users' });
  });

  it('returns an empty array when no permissions exist', async () => {
    permissions.findAll.mockResolvedValue([]);

    const output = await subject.execute();

    expect(output).toEqual([]);
  });
});