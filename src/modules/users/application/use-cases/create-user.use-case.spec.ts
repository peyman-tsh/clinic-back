import { EmailAlreadyInUseError } from '../../domain/errors/user.errors';
import { User } from '../../domain/entities/user';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserIdGenerator } from '../ports/user-id-generator';
import { PasswordHasher } from '../ports/password-hasher';
import { CreateUserUseCase } from './create-user.use-case';

class FakeUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();

  async findAll(): Promise<User[]> {
    return [...this.users.values()];
  }

  async findByEmail(email: string): Promise<User | null> {
    return [...this.users.values()].find((user) => user.email === email) ?? null;
  }

  async findByUsername(username: string): Promise<User | null> {
    return [...this.users.values()].find((user) => user.username === username) ?? null;
  }

  async findByEmployeeCode(employeeCode: string): Promise<User | null> {
    return [...this.users.values()].find((user) => user.employeeCode === employeeCode) ?? null;
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

describe('CreateUserUseCase', () => {
  const ids: UserIdGenerator = { generate: () => 'user_1' };
  const passwords: PasswordHasher = { hash: async (password) => `hashed:${password}` };
  let repository: FakeUserRepository;
  let subject: CreateUserUseCase;

  beforeEach(() => {
    repository = new FakeUserRepository();
    subject = new CreateUserUseCase(repository, ids, passwords);
  });

  it('registers and normalizes a user', async () => {
    const user = await subject.execute({
      firstName: '  Ada  ',
      lastName: '  Lovelace  ',
      email: ' ADA@EXAMPLE.COM ',
      password: 'a-secure-password',
    });

    expect(user).toMatchObject({
      id: 'user_1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
    });
    expect((await repository.findById('user_1'))?.passwordHash).toBe(
      'hashed:a-secure-password',
    );
  });

  it('rejects a duplicate email', async () => {
    await subject.execute({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      password: 'a-secure-password',
    });

    await expect(
      subject.execute({
        firstName: 'Ada',
        lastName: 'Byron',
        email: 'ADA@example.com',
        password: 'another-secure-password',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });
});
