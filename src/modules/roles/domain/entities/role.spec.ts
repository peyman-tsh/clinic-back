import { InvalidRoleError } from '../errors/role.errors';
import { Role } from './role';

describe('Role', () => {
  it('creates a role with normalized properties', () => {
    const role = Role.create({
      id: 'role_1',
      name: '  Administrator  ',
      description: '  Full CRM access  ',
    });

    expect(role.toProperties()).toMatchObject({
      id: 'role_1',
      name: 'Administrator',
      description: 'Full CRM access',
      deletedAt: null,
    });
  });

  it('updates independent fields and archives once', () => {
    const role = Role.create({ id: 'role_1', name: 'Manager' });

    role.update({ description: 'Manages a department' });
    role.archive();
    const archivedAt = role.toProperties().deletedAt;
    role.archive();

    expect(role.toProperties()).toMatchObject({
      name: 'Manager',
      description: 'Manages a department',
      deletedAt: archivedAt,
    });
  });

  it('rejects an invalid name', () => {
    expect(() => Role.create({ id: 'role_1', name: ' ' })).toThrow(
      InvalidRoleError,
    );
  });
});
