import { Inject, Injectable } from '@nestjs/common';
import {
  EmailAlreadyInUseError,
  EmployeeCodeAlreadyInUseError,
  UsernameAlreadyInUseError,
} from '../../domain/errors/user.errors';
import { User } from '../../domain/entities/user';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { USER_ID_GENERATOR } from '../ports/user-id-generator';
import type { UserIdGenerator } from '../ports/user-id-generator';
import { USER_PASSWORD_HASHER } from '../ports/password-hasher';
import type { PasswordHasher } from '../ports/password-hasher';
import { CreateUserInput, toUserOutput, UserOutput } from '../dto/user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(USER_ID_GENERATOR) private readonly ids: UserIdGenerator,
    @Inject(USER_PASSWORD_HASHER) private readonly passwords: PasswordHasher,
  ) {}

  async execute(input: CreateUserInput): Promise<UserOutput> {
    const email = User.normalizeEmail(input.email);

    if (email && (await this.users.findByEmail(email))) {
      throw new EmailAlreadyInUseError(email);
    }

    if (input.username && (await this.users.findByUsername(input.username))) {
      throw new UsernameAlreadyInUseError(input.username);
    }

    if (
      input.employeeCode &&
      (await this.users.findByEmployeeCode(input.employeeCode))
    ) {
      throw new EmployeeCodeAlreadyInUseError(input.employeeCode);
    }

    const { password, ...properties } = input;
    const passwordHash = await this.passwords.hash(password);
    const user = User.register({
      ...properties,
      id: this.ids.generate(),
      email,
      passwordHash,
    });
    await this.users.save(user);

    return toUserOutput(user);
  }
}
