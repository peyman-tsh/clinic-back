import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user';
import {
  EmailAlreadyInUseError,
  EmployeeCodeAlreadyInUseError,
  InvalidUserError,
  UsernameAlreadyInUseError,
  UserNotFoundError,
} from '../../domain/errors/user.errors';
import {
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { toUserOutput, UpdateUserInput, UserOutput } from '../dto/user.dto';
import { USER_PASSWORD_HASHER } from '../ports/password-hasher';
import type { PasswordHasher } from '../ports/password-hasher';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(USER_PASSWORD_HASHER) private readonly passwords: PasswordHasher,
  ) {}

  async execute(id: string, input: UpdateUserInput): Promise<UserOutput> {
    if (Object.values(input).every((value) => value === undefined)) {
      throw new InvalidUserError('At least one user field must be provided');
    }

    const user = await this.users.findById(id);

    if (!user) {
      throw new UserNotFoundError(id);
    }

    const { password, ...changes } = input;

    if (changes.email !== undefined) {
      const email = User.normalizeEmail(changes.email);
      if (email) {
        const existingUser = await this.users.findByEmail(email);

        if (existingUser && existingUser.id !== id) {
          throw new EmailAlreadyInUseError(email);
        }
      }

      changes.email = email;
    }

    if (changes.username !== undefined) {
      const username = User.normalizeUsername(changes.username, user.email, id);
      const existingUser = await this.users.findByUsername(username);
      if (existingUser && existingUser.id !== id) {
        throw new UsernameAlreadyInUseError(username);
      }
      changes.username = username;
    }

    if (changes.employeeCode !== undefined) {
      const code = User.normalizeEmployeeCode(changes.employeeCode, id);
      const existingUser = await this.users.findByEmployeeCode(code);
      if (existingUser && existingUser.id !== id) {
        throw new EmployeeCodeAlreadyInUseError(code);
      }
      changes.employeeCode = code;
    }

    user.update({
      ...changes,
      ...(password !== undefined
        ? { passwordHash: await this.passwords.hash(password) }
        : {}),
    });
    await this.users.save(user);

    return toUserOutput(user);
  }
}
