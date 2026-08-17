import { User } from '../../domain/entities/user';
import {
  EmailAlreadyInUseError,
  InvalidUserError,
  UserNotFoundError,
} from '../../domain/errors/user.errors';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { PasswordHasher } from '../ports/password-hasher';
import { UpdateUserUseCase } from './update-user.use-case';

class FakeUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();

  async findAll(): Promise<User[]> {
    return [...this.users.values()];
  }

  async findByEmail(email: string): Promise<User | null> {
    return (
      [...this.users.values()].find((user) => user.email === email) ?? null
    );
  }

  async findByUsername(username: string): Promise<User | null> {
    return (
      [...this.users.values()].find((user) => user.username === username) ??
      null
    );
  }

  async findByEmployeeCode(employeeCode: string): Promise<User | null> {
    return (
      [...this.users.values()].find(
        (user) => user.employeeCode === employeeCode,
      ) ?? null
    );
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}

describe('UpdateUserUseCase', () => {
  const passwords: PasswordHasher = {
    hash: async (password) => `hashed:${password}`,
  };
  let repository: FakeUserRepository;
  let subject: UpdateUserUseCase;

  beforeEach(async () => {
    repository = new FakeUserRepository();
    subject = new UpdateUserUseCase(repository, passwords);
    await repository.save(
      User.register({
        id: 'user_1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        passwordHash: 'hashed:initial-password',
      }),
    );
  });

  it('updates and normalizes the email address', async () => {
    const user = await subject.execute('user_1', {
      firstName: 'Grace',
      lastName: 'Hopper',
      email: ' GRACE@EXAMPLE.COM ',
    });

    expect(user).toMatchObject({
      id: 'user_1',
      firstName: 'Grace',
      lastName: 'Hopper',
      email: 'grace@example.com',
    });
  });

  it('rejects an empty update', async () => {
    await expect(subject.execute('user_1', {})).rejects.toBeInstanceOf(
      InvalidUserError,
    );
  });

  it('rejects an email owned by another user', async () => {
    await repository.save(
      User.register({
        id: 'user_2',
        firstName: 'Grace',
        lastName: 'Hopper',
        email: 'grace@example.com',
        passwordHash: 'hashed:another-password',
      }),
    );

    await expect(
      subject.execute('user_1', { email: 'GRACE@example.com' }),
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });

  it('rejects an unknown user', async () => {
    await expect(
      subject.execute('missing-user', { firstName: 'Unknown' }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
